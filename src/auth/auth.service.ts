import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'

@Injectable()

export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        const hashed = await bcrypt.hash(dto.password, 10)
        try {
            const user = await this.userService.create({ ...dto, password: hashed })
            const payload = { sub: user.id, email: user.email, role: user.role }
            const token = this.jwtService.sign(payload)

            return { user, token }
        } catch (error) {
            // Código de erro para violação de unicidade
            if (error.code === '23505') {
                throw new ConflictException('E-mail já cadastrado')
            }

            throw error
        }
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Usuário ou senha inválidas')
        }

        const payload = { sub: user.id, email: user.email, role: user.role }
        return { token: this.jwtService.sign(payload) }
    }
}