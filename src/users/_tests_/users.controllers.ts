import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto, GetUsersFilterDto, UpdateUserDto } from '../dto';
import { mockUserService } from './mocks/users.service.mocks';
import { UserRole, UserStatus } from '../constants/user.enum'; // Adjust import path as needed

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const filters: GetUsersFilterDto = { 
        page: 1, 
        size: 10 
      };
      const result = await controller.getUsers(filters);
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        avatar: 'avatar-url',
        address: '123 Test St',
        billingAddress: '123 Test St',
        walletBalance: 0,
        isVerified: false,
      };

      const result = await controller.createUser(createUserDto);
      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(result.role).toBe(UserRole.CUSTOMER);
    });

    it('should throw error for duplicate email', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Duplicate User',
        email: 'existing@example.com',
        password: 'password123',
        phone: '1234567890',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        avatar: 'avatar-url',
        address: '123 Test St',
        billingAddress: '123 Test St',
        walletBalance: 0,
        isVerified: false,
      };

      await expect(controller.createUser(createUserDto)).rejects.toThrow();
    });
  });

  describe('findUserAndUpdate', () => {
    it('should update user details', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        phone: '9876543210',
        role: UserRole.ADMIN,
        status: UserStatus.INACTIVE,
      };

      const result = await controller.findUserAndUpdate('1', updateUserDto);
      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Name');
      expect(result.email).toBe('updated@example.com');
      expect(result.role).toBe(UserRole.ADMIN);
    });

    it('should throw error for non-existent user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      await expect(controller.findUserAndUpdate('999', updateUserDto)).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      await expect(controller.deleteUser('1')).resolves.not.toThrow();
    });

    it('should throw error for non-existent user', async () => {
      await expect(controller.deleteUser('999')).rejects.toThrow();
    });
  });
});