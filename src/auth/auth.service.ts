import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        const hashed = await bcrypt.hash(dto.password, 10)
        try {
            const user = await this.userRepository.create({ ...dto, password: hashed })
            const payload = { sub: user.id, email: user.email }
            return { user, token: this.jwtService.sign(payload) }
        } catch (error) {
            // Código para conflito ( achei o mais apropriado pro caso )
            if (error.code === '409') {
                throw new ConflictException('E-mail já cadastrado')
            }

            throw error
        }
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Usuário ou senha inválidas')
        }

        const payload = { sub: user.id, email: user.email }
        return { token: this.jwtService.sign(payload) }
    }
}