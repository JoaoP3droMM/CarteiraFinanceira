import { Controller, Get, UseGuards, Request, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)

export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('me')
    async getProfile(@Request() req) {
        return this.usersService.findById(req.user.userId)
    }
}