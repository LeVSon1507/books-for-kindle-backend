import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { Book } from 'src/books/entities/book.entity';
import { Email } from 'src/email/entities/email.entity';

dotenvConfig({ path: '.env' });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRESQL_ADDON_HOST,
  port: parseInt(process.env.POSTGRESQL_ADDON_PORT as string),
  username: process.env.POSTGRESQL_ADDON_USER,
  password: process.env.POSTGRESQL_ADDON_PASSWORD,
  database: process.env.POSTGRESQL_ADDON_DB,
  entities: [Book, Email],
  // entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, '..', 'migrations/*{.ts,.js}')],
  migrationsRun: true,
  synchronize: true,
};

export default new DataSource(dataSourceOptions);
