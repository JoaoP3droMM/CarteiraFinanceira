import { IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ReserveTransactionDto {
  @ApiProperty({ description: 'ID da transação a ser revertida' })
  @IsInt() 
  transactionId: number
}
