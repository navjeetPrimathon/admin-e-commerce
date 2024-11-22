import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseConfig = registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  entities: [User],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development' ? ["query", "error", "schema"] : ["error"],
  ssl: process.env.NODE_ENV === 'production',
}));

// For TypeORM CLI migrations (typeorm-cli.config.ts)
export const dataSource = new DataSource({
    ...databaseConfig(),
    migrations: ['src/database/migrations/*.ts'],
    entities: ['src/**/*.entity.ts'],
  } as DataSourceOptions);
  