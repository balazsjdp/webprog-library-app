import { DataSource } from 'typeorm';
import { Book } from '../entities/Book';
import { Borrowing } from '../entities/Borrowing';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const databaseUrl = isTest
  ? (process.env.TEST_DATABASE_URL ?? 'postgresql://konyvtar:changeme@localhost:5432/konyvtar_test')
  : (process.env.DATABASE_URL ?? 'postgresql://konyvtar:changeme@localhost:5432/konyvtar');

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  synchronize: !isProduction,
  migrations: isProduction ? ['dist/migrations/*.js'] : [],
  entities: [Book, Borrowing],
  logging: process.env.NODE_ENV === 'development',
});
