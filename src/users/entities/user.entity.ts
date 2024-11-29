import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { Role } from 'src/constants/role.enum';
import { Status } from 'src/constants/status.enum';


@Entity({ name: 'user'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ default: 'customer', type: 'enum', enum: Role })
  @IsEnum(Role)
  role: Role;

  @Column({ default: 'active', type: 'enum', enum: Status })
  @IsEnum(Status)
  status: Status;

  @Column({ nullable: true })
  avatar: string; // Profile picture URL

  @Column({ nullable: true })
  address: string; // Default shipping address

  @Column({ nullable: true })
  billingAddress: string; // Default billing address

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  walletBalance: number; // For credits, loyalty points, etc.

  @Column({ default: false })
  isVerified: boolean; // Whether email/phone is 

  @Column({ nullable: true })
  lastLoginAt: Date; // Track last login date and time

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
