import { Expose } from 'class-transformer';
import { Status } from 'src/constants/status.enum';
import { Role } from 'src/constants/role.enum';

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
  status: Status;

  @Expose()
  role: Role;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
