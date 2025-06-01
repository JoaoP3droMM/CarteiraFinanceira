import { IsInt, Min } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'

export class DepositDto {
  @IsInt()
  @ApiProperty({ description: 'ID do usuário que irá receber o depósito',example: 1 })
  toUserId: number

  @IsInt()
  @ApiProperty({ description: 'Valor a ser transferido', example: 100 })
  @Min(0.01)
  value: number
}
