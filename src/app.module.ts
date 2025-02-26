import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
// import { MongooseModule } from '@nestjs/mongoose';
import { config as dotenvConfig } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/configs/orm.config';

dotenvConfig({ path: '.env' });

@Module({
  imports: [
    // MongooseModule.forRoot(String(process.env.MONGO_URI)),
    TypeOrmModule.forRoot(dataSourceOptions),
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
