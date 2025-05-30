import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config'

// Modules
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { TransactionModule } from './transactions/transaction.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port:  parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'docker',
      database: process.env.DB_DATABASE || 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true
    }),
    AuthModule,
    UsersModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}