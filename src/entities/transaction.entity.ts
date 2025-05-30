import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { User } from './user.entity'

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REVERSED = 'reversed'
}

@Entity()

export class Transaction {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, { nullable: false })
  fromUser: User

  @ManyToOne(() => User, { nullable: false })
  toUser: User

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}