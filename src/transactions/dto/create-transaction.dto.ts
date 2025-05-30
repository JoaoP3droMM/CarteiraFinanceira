import { IsInt, IsPositive } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTransactionDto {
    @ApiProperty({ description: 'ID do usuário remetente' })
    @IsInt()
    fromUserId: number

    @ApiProperty({ description: 'ID do usuário destinatário' })
    @IsInt()
    toUserId: number

    @ApiProperty({ description: 'Valor a ser transferido, maior que zero' })
    @IsPositive()
    amount: number
}