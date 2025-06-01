import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number

  @Expose()
  @ApiProperty({ example: 'João' })
  name: string

  @Expose()
  @ApiProperty({ example: 'joao@gmail.com' })
  email: string

  @Expose ()
  balance: number
}

// Aqui optei por não expor a role porque como só o root banco vai fazer transações, melhor o usuário nem saber que existe esse campo