import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ description: 'Email do usuário',example: 'joaop@carteira.com' })
  email: string

  @IsString()
  @ApiProperty({ description: 'Senha do usuário com no mínimo 6 caracteres', example: '123456' })
  @MinLength(6)
  password: string

  @IsString()
  @ApiProperty({ description: 'Nome do usuário',example: 'joaop' })
  name: string
}
