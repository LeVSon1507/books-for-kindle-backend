import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
// import { MongooseModule } from '@nestjs/mongoose';
import { config as dotenvConfig } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/configs/orm.config';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

dotenvConfig({ path: '.env' });

@Module({
  imports: [
    // MongooseModule.forRoot(String(process.env.MONGO_URI)),
    TypeOrmModule.forRoot(dataSourceOptions),
    //allow ConfigService use globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BooksModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
