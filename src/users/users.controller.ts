import { Controller, Get, Query, UseInterceptors, ValidationPipe, SerializeOptions, Body, Post, HttpCode, HttpStatus, Put, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { BulkCreateUsersDto, BulkDeleteUsersDto, BulkOperationResponseDto, BulkUpdateUsersDto, CreateUserDto, GetUsersFilterDto, PaginatedUsersResponseDto, UpdateUserDto, UserResponseDto } from './dto';

@Controller({ path: 'users' })
@SerializeOptions({
  // strategy: 'excludeAll'
})
@UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Route to fetch list of users 
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query(new ValidationPipe({
      transform: true, 
      whitelist: true,
      forbidNonWhitelisted: true,
    }))
    filters: GetUsersFilterDto
  ): Promise<PaginatedUsersResponseDto> {
    return this.usersService.getUsers(filters);
  }

  // Route to create a user
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })) 
    createUserDto: CreateUserDto
  ): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  // Route to update the user and it's properties using id or email
  @Put(":identifier")
  @HttpCode(HttpStatus.OK)
  async findUserAndUpdate(
    @Param('identifier') identifier: string,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }))
      updateUserDto: UpdateUserDto
  ) : Promise<UserResponseDto> {
    const user  = await this.usersService.findUserAndUpdate(identifier, updateUserDto)
    return user
  }


    // Route to delete the user using email or id
    @Delete(":identifier")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(
      @Param('identifier') identifier: string,
    ): Promise<void> {
      await this.usersService.deleteUser(identifier);
    }


    // User Route to Add Users in Bulk
    @Post('bulk')
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
  
    @Put('bulk')
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
  
    @Delete('bulk')
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