import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { TransactionService } from './transaction.service'
import { Roles } from '../auth/roles.decorator'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { ReserveTransactionDto } from './dto/reserve-transaction.dto'
import { DepositDto } from './dto/deposit.dto' 
import { RolesGuard } from 'src/auth/roles.guard'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')

export class TransactionController {
  constructor(private txService: TransactionService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.txService.create(dto)
  }

  @Post('reserve')
    reserve(@Body() dto: ReserveTransactionDto) {
    return this.txService.reserve(dto)
  }

  // Realiza o deposito nas contas só para quem for root
  @Post('deposit')
  @Roles('root')
  async deposit(@Body() dto: DepositDto) {

    return this.txService.deposit(dto.toUserId, dto.value)
  }

  /* Lista todas as transações */
  @Get()
  listAll() {
    return this.txService.listAll();
  }

  @Get('user/:identifier')
  listByUser(@Param('identifier') identifier: string) {
    return this.txService.listByUser(identifier);
  }

  @Get(':id')
  findAll(@Param('id') id: number) {
    return this.txService.findOne(id)
  }
}
