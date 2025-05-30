import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Exclude } from 'class-transformer'

@Entity()

export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Exclude()
  @Column()
  password: string

  @Column()
  name: string

  @Column('decimal', { default: 0 })
  balance: number
}
