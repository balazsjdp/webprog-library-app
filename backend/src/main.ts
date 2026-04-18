import './config/otel'; // MUST be the very first import
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { redis } from './config/redis';
import { app } from './app';

const PORT = Number(process.env.PORT) || 4000;

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Database connection established');

  await redis.connect();
  console.log('Redis connection established');

  if (process.env.NODE_ENV === 'production') {
    await AppDataSource.runMigrations();
    console.log('Migrations completed');
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
