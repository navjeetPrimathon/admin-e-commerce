import { Expose } from 'class-transformer';
import { UserRole, UserStatus } from '../constants/user.enum';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  status: UserStatus;

  @Expose()
  role: UserRole;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
