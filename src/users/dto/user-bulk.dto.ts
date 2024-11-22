import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './ceate-users.dto';
import { UpdateUserDto } from './update-user.dto';


export class BulkCreateUsersDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    users: CreateUserDto[];
  }
  
  export class BulkUpdateUsersDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateUserDto)
    updates: { identifier: string; data: UpdateUserDto }[];
  }
  
  export class BulkDeleteUsersDto {
    @IsArray()
    identifiers: string[];
  }
  
  export class BulkOperationResponseDto {
    successful: number;
    failed: number;
    errors?: { identifier: string; error: string }[];
  }