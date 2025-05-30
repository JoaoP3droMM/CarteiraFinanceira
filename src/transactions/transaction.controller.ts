import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { TransactionService } from './transaction.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { ReserveTransactionDto } from './dto/reserve-transaction.dto'

@Controller('transactions')
@UseGuards(JwtAuthGuard)

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
