import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'

@Injectable()

export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  create(user: Partial<User>){
    return this.repo.save(user)
  }

  findByEmail(email: string){
    return this.repo.findOne({ where : { email } })
  }

  async findById(id: number){
    const user = await this.repo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('Usuário não encontrado')
    return user
  }
}