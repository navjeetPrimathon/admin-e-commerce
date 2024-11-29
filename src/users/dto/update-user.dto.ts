import { IsOptional, IsString, IsEnum, Min, IsEmail, IsDecimal, IsBoolean, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from 'src/constants/role.enum';
import { Status } from 'src/constants/status.enum';

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
  
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
  
    @IsEnum(Status)
    @IsOptional()
    status?: Status;
  
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
    // @Min(0)
    @IsOptional()
    @Transform(({ value }) => parseFloat(value).toFixed(2))
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