import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Transaction } from './transaction.entity'

export enum UserRole {
  USER = 'user',
  ROOT = 'root'
}

@Entity()

export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Exclude()
  @Column()
  password: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole

  @Column('decimal', { default: 0 })
  balance: number

  @OneToMany(() => Transaction, tx => tx.fromUser)
  sentTransactions: Transaction[]

  @OneToMany(() => Transaction, tx => tx.toUser)
  receivedTransactions: Transaction[]
}
