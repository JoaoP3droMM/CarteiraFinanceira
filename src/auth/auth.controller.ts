import { Controller, Post, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('auth')

export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiOkResponse({ description: 'Realiza cadastro do usuário.', type: RegisterDto })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }

    @Post('login')
    @ApiOkResponse({ description: 'Realiza login do usuário.', type: LoginDto })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password)
    }
}