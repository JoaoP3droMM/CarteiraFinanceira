# Projeto: Carteira Financeira

## Tecnologias Utilizadas
- Node.js
- NestJS
- TypeScript
- PostgreSQL
- ORM: TypeORM ou Prisma
- Docker
- Jest (testes unitários e integração)
- Swagger (documentação da API)

---

## Objetivo
Criar uma carteira financeira onde usuários podem transferir saldo entre si, garantindo segurança, consistência e reversibilidade das operações.

---

## Funcionalidades / Requisitos

### Funcionais
- Cadastro de usuários
- Autenticação via JWT
- Transferência de saldo entre usuários
- Validação de saldo antes da transferência
- Transações atômicas e possibilidade de reversão
- Histórico de transações

### Não funcionais
- Segurança (hash de senhas, validações, tratamento de erros)
- Logging e monitoramento
- Documentação clara da API
- Testes unitários e de integração

---

## Modelagem de Dados

### Tabela User
| Campo       | Tipo   | Descrição                 |
|-------------|--------|---------------------------|
| id          | UUID   | Identificador único       |
| name        | string | Nome do usuário           |
| email       | string | Email (único)             |
| passwordHash| string | Senha com hash bcrypt     |
| balance     | decimal| Saldo atual               |
| createdAt   | Date   | Data de criação           |
| updatedAt   | Date   | Data da última atualização|

### Tabela Transaction
| Campo      | Tipo    | Descrição                          |
|------------|---------|----------------------------------|
| id         | UUID    | Identificador da transação        |
| senderId   | UUID    | Usuário que envia dinheiro        |
| receiverId | UUID    | Usuário que recebe dinheiro       |
| amount     | decimal | Valor transferido                 |
| status     | enum    | Status: PENDING, COMPLETED, REVERTED |
| createdAt  | Date    | Data da transação                 |
| updatedAt  | Date    | Data da última atualização       |

---

## Endpoints API

| Método | Rota                         | Descrição                              |
|--------|------------------------------|--------------------------------------|
| POST   | /auth/register               | Registrar novo usuário                |
| POST   | /auth/login                  | Autenticar usuário e gerar token JWT |
| GET    | /users/me                   | Dados do usuário autenticado          |
| POST   | /transactions               | Criar transferência                   |
| GET    | /transactions               | Listar transações do usuário          |
| POST   | /transactions/:id/revert    | Reverter uma transação                |

---

## Lógica e Considerações Técnicas

- Autenticação JWT e proteção de rotas
- Senhas armazenadas com hash (bcrypt)
- Validação do saldo antes da transferência
- Uso de transações no banco para garantir atomicidade
- Reversão de transações com ajuste de saldo e status
- Tratamento detalhado de erros (ex.: saldo insuficiente)
- Logs para auditoria

---

## Diferenciais / Extras

- Containerização com Docker e Docker Compose
- Testes unitários e de integração com Jest
- Documentação automática com Swagger
- Middleware de logging (ex: Winston)

---

## Cronograma Sugerido

| Etapa                   | Objetivo                                    | Tempo Estimado |
|-------------------------|---------------------------------------------|---------------|
| Setup inicial NestJS + DB | Criar projeto, configurar ORM, docker       | 2-3 horas     |
| Cadastro e autenticação  | Registro, login, hash senha, JWT            | 3 horas      |
| CRUD usuário + saldo     | Endpoint perfil e saldo                      | 1 hora       |
| Transferência            | Lógica de transferência e validações       | 4 horas      |
| Reversão da transação    | Endpoint e lógica de reversão                | 2 horas      |
| Testes                   | Unitários e integração                       | 4 horas      |
| Documentação e logs      | Swagger e logging                            | 2 horas      |
| Ajustes finais           | Debug e preparação para apresentação         | 2 horas      |

---

## Considerações Finais

Este projeto tem como foco a segurança, integridade dos dados e boa experiência para o usuário. O uso de transações no banco e reversão de operações garantem confiabilidade.

---

Boa sorte no desafio! Caso queira, posso ajudar na implementação inicial do projeto, como estrutura NestJS, configuração de banco e autenticação.

