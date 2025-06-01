import { Controller, Get, UseGuards, Request, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UserResponseDto } from './dto/user-response.dto'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)

export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('me')
    @ApiOkResponse({ description: 'Retorna o perfil do usuário autenticado pelo token', type: UserResponseDto })
    async getProfile(@Request() req): Promise<UserResponseDto> {
        return this.usersService.findById(req.user.userId)
    }
}