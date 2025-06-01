import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

describe('AuthService', () => {
  let authService: AuthService
  let jwtService: JwtService
  let usersService: UsersService

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-token'),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
    usersService = module.get<UsersService>(UsersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('deve registrar o usuário com sucesso', async () => {
      const dto = { email: 'test@example.com', password: 'password', name: 'Test User' }
      mockUsersService.create.mockResolvedValue({ id: 1, ...dto, role: 'user' })

      const result = await authService.register(dto)

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('token', 'mocked-token')
    })

    it('deve lançar um erro de conflito se o email já estiver em uso', async () => {
      const dto = { email: 'test@example.com', password: 'password', name: 'Test User' }

      const error = new Error() as any
      error.code = '409'
      mockUsersService.create.mockRejectedValue(error)

      await expect(authService.register(dto)).rejects.toThrow(ConflictException)
    })
  })

  describe('login', () => {
    it('deve autenticar o usuário com sucesso', async () => {
      const email = 'test@example.com'
      const password = 'password'
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = { id: 1, email, password: hashedPassword, role: 'user' }

      mockUsersService.findByEmail.mockResolvedValue(user)

      const result = await authService.login(email, password)

      expect(result).toHaveProperty('token', 'mocked-token')
    })

    it('deve lançar um erro se o usuário não for encontrado', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null)

      await expect(authService.login('error@example.com', '123456')).rejects.toThrow(UnauthorizedException)
    })

    it('deve lançar um erro se a senha estiver incorreta', async () => {
      const email = 'test@example.com'
      const user = {
        id: 1,
        email,
        password: await bcrypt.hash('senha-correta', 10),
        role: 'user',
      }

      mockUsersService.findByEmail.mockResolvedValue(user)

      await expect(authService.login(email, 'senha-errada')).rejects.toThrow(UnauthorizedException)
    })
  })
})
