import { Controller, UseInterceptors, ValidationPipe, SerializeOptions, Body, Post, HttpCode, HttpStatus, Put, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { BulkCreateUsersDto, BulkDeleteUsersDto, BulkOperationResponseDto, BulkUpdateUsersDto } from './dto';

@Controller({ path: 'user/bulk' })
@SerializeOptions({
  // strategy: 'excludeAll'
})
@UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)

export class BulkUsersController {
  constructor(private readonly usersService: UsersService) { }

    // User Route to Add Users in Bulk
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createBulkUsers(
      @Body(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        })
      )
      bulkCreateUsersDto: BulkCreateUsersDto
    ): Promise<BulkOperationResponseDto> {
      return this.usersService.createBulkUsers(bulkCreateUsersDto);
    }
  
    @Put()
    @HttpCode(HttpStatus.OK)
    async updateBulkUsers(
      @Body(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        })
      )
      bulkUpdateUsersDto: BulkUpdateUsersDto
    ): Promise<BulkOperationResponseDto> {
      return this.usersService.updateBulkUsers(bulkUpdateUsersDto);
    }
  
    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBulkUsers(
      @Body(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        })
      )
      bulkDeleteUsersDto: BulkDeleteUsersDto
    ): Promise<void> {
      await this.usersService.deleteBulkUsers(bulkDeleteUsersDto);
    }
}