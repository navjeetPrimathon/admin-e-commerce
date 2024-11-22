import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole, UserStatus } from '../constants/user.enum';

export class GetUsersFilterDto {
    @IsOptional()
    @IsString()
    id?: string;
  
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    email?: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
  
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
  
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    page?: number = 1;
  
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    @Max(100)
    size?: number = 10;
  }
  