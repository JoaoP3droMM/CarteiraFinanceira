import { DataSource } from 'typeorm'
import { User, UserRole } from '../entities/user.entity'
import * as bcrypt from 'bcrypt'

export async function createRootUser(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User)

    // Se já existir um usuário root, não cria outro
    if (await userRepository.findOne({ where: { email: 'banco@root.com' } })) return
    
    const hashedPassword = await bcrypt.hash('senha-bem-segura-para-root', 10)

    // Cria usuário root mas não salva ainda
    await userRepository.save({
        name: 'Banco root',
        email: 'banco@root.com',
        password: hashedPassword,
        role: UserRole.ROOT,
        balance: 0
    })

    console.log('Usuário root criado com sucesso!')
}