import { NestFactory } from '@nestjs/core'
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Reflector } from '@nestjs/core'
import { DataSource } from 'typeorm'
import { AppModule } from './app.module'
import 'dotenv/config'
import { createRootUser } from './seed/root-user.seed'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 1) Validação global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // remove propriedades não-decoradas
    forbidNonWhitelisted: true, // retorna erro se houver extras
    transform: true,            // converte params, bodies, query para seus tipos (p.ex: string → number)
  }))

  // 2) Serialização global (ClassSerializerInterceptor)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  )

  // 3) (Opcional) Swagger
  const config = new DocumentBuilder()
    .setTitle('API Carteira Financeira')
    .setDescription('Endpoints de autenticação, usuários e transações')
    .setVersion('1.0')
    .addBearerAuth()    // para JWT no Swagger UI
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  // 4) Cria usuário root
  const dataSource = app.get<DataSource>(DataSource)
  await createRootUser(dataSource)

  // CORS, prefixos, etc., se quiser
  app.enableCors()

  const port = process.env.PORT || 3000
  await app.listen(port)
  Logger.log(`🚀 Servidor rodando na porta ${port}`)
}

bootstrap()