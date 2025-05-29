import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import { User } from './user.entity'

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REVERTED = 'REVERTED',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.sentTransactions)
  @JoinColumn({ name: 'senderId' })
  @Index()
  sender: User

  @Column()
  senderId: string

  @ManyToOne(() => User, (user) => user.receivedTransactions)
  @JoinColumn({ name: 'receiverId' })
  @Index()
  receiver: User

  @Column()
  receiverId: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}