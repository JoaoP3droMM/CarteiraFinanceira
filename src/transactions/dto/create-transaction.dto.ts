import { IsInt, IsPositive } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTransactionDto {
    @ApiProperty({ description: 'ID do usuário remetente', example: 1 })
    @IsInt()
    fromUserId: number

    @ApiProperty({ description: 'ID do usuário destinatário', example: 2 })
    @IsInt()
    toUserId: number

    @ApiProperty({ description: 'Valor a ser transferido, maior que zero', example: 100 })
    @IsPositive()
    amount: number
}