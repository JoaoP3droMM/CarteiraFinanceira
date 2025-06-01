import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository, QueryRunner } from 'typeorm'
import { Transaction, TransactionStatus, TransactionType } from '../entities/transaction.entity'
import { User, UserRole } from '../entities/user.entity'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { ReserveTransactionDto } from './dto/reserve-transaction.dto'

@Injectable()

export class TransactionService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(Transaction)
        private txRepo: Repository<Transaction>,
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {}

    async create(dto: CreateTransactionDto): Promise<Transaction> {
        const { fromUserId, toUserId, amount } = dto

        if (fromUserId === toUserId) {
            throw new BadRequestException('Não é possível fazer uma transferência para si mesmo')
        }

        const queryRunner: QueryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const fromUser = await queryRunner.manager.findOne(User, { where: { id: fromUserId } })
            const toUser = await queryRunner.manager.findOne(User, { where: { id: toUserId } })

            if (!fromUser || !toUser) {
                throw new NotFoundException('Usuário não encontrado')
            }

            if (+fromUser.balance < amount) {
                throw new BadRequestException('Saldo insuficiente')
            }

            // Cria registro de transação PENDING
            const tx = this.txRepo.create({ fromUser, toUser, amount })
            const savedTx = await queryRunner.manager.save(tx)

            // Atualiza saldos
            fromUser.balance = +fromUser.balance - amount
            toUser.balance = +toUser.balance + amount
            await queryRunner.manager.save(fromUser)
            await queryRunner.manager.save(toUser)

            // Marca transação como COMPLETED
            savedTx.status = TransactionStatus.COMPLETED
            await queryRunner.manager.save(savedTx)


            await queryRunner.commitTransaction()
            return savedTx
        } catch(error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }

    // Realiza a reversão de transação
    async reserve(dto: ReserveTransactionDto): Promise<Transaction> {
        const { transactionId  } = dto
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const tx = await queryRunner.manager.findOne(Transaction, {
                where: { id: transactionId },
                relations: ['fromUser', 'toUser']
            })

            if (!tx) {
                throw new NotFoundException('Transação não encontrada')
            }

            if (tx.status !== TransactionStatus.COMPLETED) {
                throw new BadRequestException('Só é possível reverter transações completas')
            }

            // Converte string em number
            const value = Number(tx.amount)

            const { fromUser, toUser } = tx

            // Desfaz saldos
            toUser.balance = Number(toUser.balance) - value
            fromUser.balance = Number(fromUser.balance) + value
            await queryRunner.manager.save(toUser)
            await queryRunner.manager.save(fromUser)

            // Marca transação como REVERSED
            tx.status = TransactionStatus.REVERSED
            await queryRunner.manager.save(tx)

            await queryRunner.commitTransaction()
            return tx
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }

    // Realiza o depósito
    async deposit(toUserId: number, amount: number): Promise<Transaction> {

        // Busca usuário que receberá o depósito
        const toUser = await this.userRepo.findOne({ where: { id: toUserId } })
        if (!toUser) {
            throw new NotFoundException('Usuário de destino não encontrado')
        }

        // Carrega o usuário que fará o depósito ( root )
        const fromUser = await this.userRepo.findOne({ where: { role: UserRole.ROOT } })
        if (!fromUser) {
            throw new NotFoundException('Usuário de origem não encontrado')
        }

        // Atualiza saldo
        toUser.balance = +toUser.balance + amount
        await this.userRepo.save(toUser)

        // Registra a transação atribuindo um fromUser
        const tx = this.txRepo.create({
            fromUser,
            toUser,
            amount,
            status: TransactionStatus.COMPLETED,
            type: TransactionType.DEPOSIT
        })

        return this.txRepo.save(tx)
    }

    // Lista todas as transações
    async listAll(): Promise<Transaction[]> {
        return this.txRepo.find({
            relations: ['fromUser', 'toUser'],
            order: {createdAt: 'DESC'}
        })
    }

    // Lista transações por usuário
    async listByUser(itendifier: string): Promise<Transaction[]> {
        let user: User | null

        // Se vier um email (identifica pelo @), busca por email
        if (itendifier.includes('@')) {
            user = await this.userRepo.findOne({ where: { email: itendifier } })
        } else {
            // Senão, busca por id
            const id = parseInt(itendifier, 10)
            if (isNaN(id)) {
                throw new BadRequestException('Identificador inválido')
            }

            user = await this.userRepo.findOne({ where: { id } })
        }

        if (!user) {
            throw new NotFoundException('Usuário não encontrado')
        }

        return this.txRepo.find({
            where: [
                { fromUser: { id: user.id } },
                { toUser: { id: user.id } }
            ],
            relations: ['fromUser', 'toUser'],
            order: { createdAt: 'DESC' }
        })
    }

    // Busca transação especifica por ID
    async findOne(id: number): Promise<Transaction> {
        const tx = await this.txRepo.findOne({
            where: { id },
            relations: ['fromUser', 'toUser']
        })

        if (!tx) {
            throw new NotFoundException(`Transação ${id} não encontrada`)
        }
        
        return tx
    }

}
