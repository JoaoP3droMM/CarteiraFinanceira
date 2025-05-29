import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Transaction } from './transaction.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  passwordHash: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  balance: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Transaction, (transaction) => transaction.sender)
  sentTransactions: Transaction[]

  @OneToMany(() => Transaction, (transaction) => transaction.receiver)
  receivedTransactions: Transaction[]
}