import { IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ReserveTransactionDto {
  @ApiProperty({ description: 'ID da transação a ser revertida', example: 1 })
  @IsInt() 
  transactionId: number
}
