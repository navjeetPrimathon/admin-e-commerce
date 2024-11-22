import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from '../config/redis.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Make sure UserRepository is available
    RedisCacheModule
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
