import { Expose } from 'class-transformer'

export class UserResponseDto {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose ()
  balance: number
}

// Aqui optei por não expor a role porque como só o root banco vai fazer transações, melhor o usuário nem saber que existe esse campo