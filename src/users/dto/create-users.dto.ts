import { IsOptional, IsString, IsEnum, Min, IsEmail, IsDecimal, IsBoolean } from 'class-validator';
import { Role } from 'src/constants/role.enum';
import { Status } from 'src/constants/status.enum';

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

  @IsEnum(Role)
  role: Role;

  @IsEnum(Status)
  status: Status;

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
