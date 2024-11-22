import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRole, UserStatus } from '../../constants/user.enum'; // Adjust import path as needed

export const mockUserService = {
  getUsers: jest.fn().mockImplementation((filters) => ({
    data: [
      {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        phone: '1234567890',
        avatar: 'avatar-url',
        address: '123 Test St',
        billingAddress: '123 Test St',
        walletBalance: 0,
        isVerified: false,
      }
    ],
    meta: {
      total: 1,
      page: 1,
      size: 10,
      totalPages: 1,
      hasMore: false
    }
  })),

  createUser: jest.fn().mockImplementation((dto) => {
    if (dto.email === 'existing@example.com') {
      throw new ConflictException('Email already exists');
    }
    return {
      id: 1,
      ...dto,
      role: dto.role || UserRole.CUSTOMER,
      status: dto.status || UserStatus.ACTIVE,
      isVerified: false,
      walletBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
    };
  }),

  findUserAndUpdate: jest.fn().mockImplementation((identifier, dto) => {
    if (identifier === '999') {
      throw new NotFoundException('User not found');
    }
    return {
      id: identifier,
      ...dto,
      name: dto.name || 'Test User',
      email: dto.email || 'test@example.com',
      role: dto.role || UserRole.CUSTOMER,
      status: dto.status || UserStatus.ACTIVE,
      updatedAt: new Date(),
    };
  }),

  deleteUser: jest.fn().mockImplementation((identifier) => {
    if (identifier === '999') {
      throw new NotFoundException('User not found');
    }
    return;
  }),
};