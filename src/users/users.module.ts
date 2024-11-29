import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from '../config/redis.config';
import { BulkUsersController } from './bulk-users.controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisCacheModule
  ],
  providers: [UsersService],
  controllers: [UsersController, BulkUsersController],
  exports: [UsersService]
})
export class UsersModule {}
