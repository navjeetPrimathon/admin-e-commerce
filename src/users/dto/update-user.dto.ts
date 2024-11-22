import { IsOptional, IsString, IsEnum, Min, IsEmail, IsDecimal, IsBoolean, IsDate } from 'class-validator';
import { UserRole, UserStatus } from '../constants/user.enum';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsEmail()
    @IsOptional()
    email?: string;
  
    @IsOptional()
    phone?: string;
  
    @IsString()
    @IsOptional()
    password?: string;
  
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
  
    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;
  
    @IsString()
    @IsOptional()
    avatar?: string;
  
    @IsString()
    @IsOptional()
    address?: string;
  
    @IsString()
    @IsOptional()
    billingAddress?: string;
  
    @IsDecimal()
    @Min(0)
    @IsOptional()
    walletBalance?: number;
  
    @IsBoolean()
    @IsOptional()
    isVerified?: boolean;
  
    @IsDate()
    @IsOptional()
    createdAt?: Date;
  
    @IsDate()
    @IsOptional()
    updatedAt?: Date;
  }