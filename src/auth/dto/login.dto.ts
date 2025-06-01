import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @IsEmail()
  @ApiProperty({ description: 'Email do usuário', example: 'joaop@carteira.com' })
  email: string

  @IsString()
  @ApiProperty({ description: 'Senha do usuário', example: '123456' })
  password: string
}