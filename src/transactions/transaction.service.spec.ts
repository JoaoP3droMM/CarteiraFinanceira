import { Test, TestingModule } from '@nestjs/testing'
import { TransactionService } from './transaction.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Transaction } from '../entities/transaction.entity'
import { User } from '../entities/user.entity'
import { Repository, DataSource } from 'typeorm'

describe('TransactionService', () => {
  let service: TransactionService
  let transactionRepository: Repository<Transaction>
  let userRepository: Repository<User>

  const mockTxRepo = {
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  }

  const mockUserRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  }

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      findOne: jest.fn(),
      save: jest.fn(),
    }
  }

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: getRepositoryToken(Transaction), useValue: mockTxRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: DataSource, useValue: mockDataSource }
      ],
    }).compile()

    service = module.get<TransactionService>(TransactionService)
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction))
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('deve criar uma transação com sucesso (cenário feliz)', async () => {
      // Escreva o teste aqui conforme os mocks forem implementados
    })

    it('deve lançar exceção se fromUser e toUser forem iguais', async () => {
      const dto = { fromUserId: 1, toUserId: 1, amount: 100 }

      await expect(service.create(dto as any)).rejects.toThrow('Não é possível fazer uma transferência para si mesmo')
    })

    // Adicione mais cenários de erro e sucesso aqui
  })

  describe('reserve', () => {
    it('deve reverter uma transação completa', async () => {
      // Implemente o teste com mocks apropriados
    })

    it('deve lançar exceção se a transação não for encontrada', async () => {
      mockQueryRunner.manager.findOne.mockResolvedValue(null)

      await expect(service.reserve({ transactionId: 1 })).rejects.toThrow('Transação não encontrada')
    })

    // Outros cenários podem ser testados também
  })

  describe('deposit', () => {
    it('deve depositar corretamente para um usuário', async () => {
      // Teste básico de depósito
    })

    it('deve lançar exceção se o usuário de destino não existir', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(null)

      await expect(service.deposit(1, 100)).rejects.toThrow('Usuário de destino não encontrado')
    })
  })

  describe('listAll', () => {
    it('deve retornar uma lista de transações', async () => {
      const mockTransactions = [
        { id: 1, amount: 100 },
        { id: 2, amount: 100 },
      ] as Transaction[]

      mockTxRepo.find.mockResolvedValue(mockTransactions)

      const result = await service.listAll()

      expect(result).toEqual(mockTransactions)
      expect(mockTxRepo.find).toHaveBeenCalledWith({
        relations: ['fromUser', 'toUser'],
        order: { createdAt: 'DESC' }
      })
    })
  })

  describe('listByUser', () => {
    it('deve listar transações por ID do usuário', async () => {
      // Implemente conforme necessário
    })

    it('deve lançar exceção se o identificador for inválido', async () => {
      await expect(service.listByUser('abc')).rejects.toThrow('Identificador inválido')
    })
  })

  describe('findOne', () => {
    it('deve retornar uma transação específica', async () => {
      const mockTransaction = { id: 1 } as Transaction
      mockTxRepo.findOne.mockResolvedValue(mockTransaction)

      const result = await service.findOne(1)

      expect(result).toBe(mockTransaction)
      expect(mockTxRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['fromUser', 'toUser']
      })
    })

    it('deve lançar exceção se a transação não for encontrada', async () => {
      mockTxRepo.findOne.mockResolvedValue(null)

      await expect(service.findOne(1)).rejects.toThrow('Transação 1 não encontrada')
    })
  })
})
