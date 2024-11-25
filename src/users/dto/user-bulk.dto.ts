import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-users.dto';
import { UpdateUserPayloadDto } from './update-user-payload.dto';


export class BulkCreateUsersDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    users: CreateUserDto[];
  }
  
  export class BulkUpdateUsersDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateUserPayloadDto)
    updates: UpdateUserPayloadDto[];
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