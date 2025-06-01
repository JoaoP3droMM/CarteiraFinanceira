import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { TransactionService } from './transaction.service'
import { Roles } from '../auth/roles.decorator'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { ReserveTransactionDto } from './dto/reserve-transaction.dto'
import { DepositDto } from './dto/deposit.dto' 
import { RolesGuard } from '../auth/roles.guard'

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')

export class TransactionController {
  constructor(private txService: TransactionService) {}

  @Post()
  @ApiOkResponse({ description: 'Cria uma transação entre dois usuários existentes', type: CreateTransactionDto })
  create(@Body() dto: CreateTransactionDto) {
    return this.txService.create(dto)
  }

  @Post('reserve')
  @ApiOkResponse({ description: 'Refaz uma transação, extornando o valor para o usuário que enviou a transação', type: ReserveTransactionDto })
    reserve(@Body() dto: ReserveTransactionDto) {
    return this.txService.reserve(dto)
  }

  @Post('deposit')
  @ApiOkResponse({ description: 'Faz o depósito em uma conta. Apenas para root', type: DepositDto })
  @Roles('root')
  async deposit(@Body() dto: DepositDto) {

    return this.txService.deposit(dto.toUserId, dto.value)
  }

  @Get()
  listAll() {
    return this.txService.listAll();
  }
}
