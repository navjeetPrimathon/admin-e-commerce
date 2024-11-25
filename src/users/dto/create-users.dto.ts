import { IsOptional, IsString, IsEnum, Min, IsEmail, IsDecimal, IsBoolean } from 'class-validator';
import { UserRole, UserStatus } from '../constants/user.enum';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  phone?: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(UserStatus)
  status: UserStatus;

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
}
