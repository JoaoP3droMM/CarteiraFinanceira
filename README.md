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

### Criando o Banco de Dados via docker
docker run --name carteira-db -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=carteira -d postgres

docker run: Este é o comando básico para executar um novo container Docker.
--name carteira-db: Atribui o nome carteira-db ao container.
-p 5432:5432: Mapeia a porta 5432 do container para a porta 5432 da máquina host. Utilizei esta porque é a padrão do PostgreSQL.
-e POSTGRES_USER=admin: Define a variável de ambiente POSTGRES_USER dentro do container.
-e POSTGRES_PASSWORD=password: Define a variável de ambiente POSTGRES_PASSWORD para a senha do usuário que foi definido acima
-e POSTGRES_DB=carteira: Define a variável de ambiente POSTGRES_DB para o nome do banco de dados que será criado automaticamente na inicialização do container. 
-d postgres: Especifica a imagem do Docker Hub que será usada para criar o container. Aqui, estou usando a imagem oficial do PostgreSQL (postgres). O flag -d significa "detached", o que faz com que o container rode em segundo plano.

Agora que o banco está criado, para rodar faço:

docker run --name carteira-db -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=carteira -d postgres

Para ver se está tudo ok, rode:

docker ps que deve mostrar algo como:

CONTAINER ID   IMAGE      COMMAND                  CREATED              STATUS              PORTS                                       NAMES
87d371ac2e78   postgres   "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   carteira-db

OPICIONAL: Para visualizar o banco de dados em um gerenciador como PGAdmin ou DBeaver ( o que estou usando ), basta clicar em nova conexão, selecionar PostgreSQL e preencher os dados de conexão com os dados do container, que no caso é localhost, 5432, admin e password.

### Criando as tabelas
Para criar as tabelas eu usei o TypeORM, que é um ORM que permite criar as tabelas via código.

1 - Instalei o TypeORM pelo comando:
  npm install @nestjs/typeorm typeorm pg --save

  depois:

  npm install @types/node --save-dev

  O segundo comando consiste em definições de tipo para o Node.js (podem ser necessárias para algumas funcionalidades do TypeORM).

2 - Configurei o app.module.ts para importar o TypeORM que acabei de instalar, fazendo a conexão com os mesmos dados que usamos no dbeaver, usuário, host, porta e senha

3 - Criei as entidades User e Transaction, que são as tabelas que criamos acima, com os mesmos nomes e campos.

4 - Rodei a aplicação para criar as tabelas no banco de dados.
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