import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BulkCreateUsersDto, BulkDeleteUsersDto, BulkOperationResponseDto, BulkUpdateUsersDto, CreateUserDto, GetUsersFilterDto, PaginatedUsersResponseDto, UpdateUserDto, UserResponseDto } from './dto';
import { plainToClass } from 'class-transformer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_KEYS } from './constants/cache-key.constant';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly CACHE_TTL = 300 * 1000; // 5 minutes

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  private mapUserToDto(user: User): UserResponseDto {
    const plainUser = { ...user };
    return plainToClass(UserResponseDto, plainUser, {
      excludeExtraneousValues: true,
    });
  }

  private async clearUserRelatedCaches(identifier: string, email?: string): Promise<void> {
    try {
      const cachesToClear = [
        CACHE_KEYS.USER_LIST,
        CACHE_KEYS.USER_DETAIL(identifier),
      ];

      if (email) {
        cachesToClear.push(CACHE_KEYS.USER_EMAIL(email));
      }

      // Clear any filtered results
      const filterKeys = await this.cacheManager.store.keys(CACHE_KEYS.USERS_FILTERED('*'));
      console.log(filterKeys,"filtered keys to delete")
      cachesToClear.push(...filterKeys);
      console.log(cachesToClear,"cache to clear from redis")
      await Promise.all(cachesToClear.map(key => this.cacheManager.del(key)));
      this.logger.debug(`Cleared caches: ${cachesToClear.join(', ')}`);
    } catch (error) {
      this.logger.warn(`Failed to clear cache: ${error.message}`);
    }
  }


  // Create a user
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Check cache first for existing email
      const cachedUser = await this.cacheManager.get(CACHE_KEYS.USER_EMAIL(createUserDto.email));
      if (cachedUser) {
        throw new ConflictException('Email already exists');
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        await this.cacheManager.set(
          CACHE_KEYS.USER_EMAIL(existingUser.email),
          existingUser,
          this.CACHE_TTL
        );
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      // Create new user
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        isVerified: false,
        walletBalance: 0,
        lastLoginAt: null,
      });

      // Save user
      const savedUser = await this.userRepository.save(user);

      // Clear related caches
      await this.clearUserRelatedCaches(savedUser.id.toString(), savedUser.email);

      // return result;
      return this.mapUserToDto(savedUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }


  // Method to find list of users by filtering and pagination
  async getUsers(filters: GetUsersFilterDto): Promise<PaginatedUsersResponseDto> {
    try {
      // Generate cache key based on filters
      const filterHash = JSON.stringify(filters);
      const cacheKey = CACHE_KEYS.USERS_FILTERED(filterHash);

      // Try to get from cache
      const cachedResult = await this.cacheManager.get<PaginatedUsersResponseDto>(cacheKey);
      if (cachedResult) {
        this.logger.debug('Returning users from cache');
        return cachedResult;
      }

      const query = this.userRepository.createQueryBuilder('user');

      if (filters.name) {
        query.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
          name: `%${filters.name}%`
        });
      }

      if (filters.email) {
        query.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
          email: `%${filters.email}%`
        });
      }

      if (filters.phone) {
        query.andWhere('user.phone = :phone', {
          phone: filters.phone
        });
      }

      if (filters.status) {
        query.andWhere('user.status = :status', {
          status: filters.status
        });
      }

      if (filters.role) {
        query.andWhere('user.role = :role', {
          role: filters.role
        });
      }

      // query.orderBy('user.created_at', 'DESC');

      const skip = (filters.page - 1) * filters.size;

      const [users, total] = await query
        .skip(skip)
        .take(filters.size)
        .getManyAndCount()

      const plainUsers = users.map(user => ({ ...user }));

      const mappedUsers = plainUsers.map(user => this.mapUserToDto(user));

      const result = {
        data: mappedUsers,
        meta: {
          total,
          page: filters.page,
          size: filters.size,
          totalPages: Math.ceil(total / filters.size),
          hasMore: filters.page * filters.size < total
        }
      };

      // Cache the result
      console.log(this.CACHE_TTL, "CACHE TTL")
      await this.cacheManager.set(cacheKey, result, this.CACHE_TTL);

      return result;

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  // Method to find user by id or email and update it
  async findUserAndUpdate(identifier: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    try {
      let user: User | null;

      // Try to get user from cache first
      const cacheKey = CACHE_KEYS.USER_DETAIL(identifier);
      user = await this.cacheManager.get<User>(cacheKey);

      console.log(user, "userssssssssssssssssssssssssssssssssssssssssssssss")
      // If user is not found, throw an exception
      if (!user) {
        user = await this.findUserByIdentifier(identifier);

        if (!user) {
          throw new NotFoundException('User not found');
        }

        // Cache the found user
        await this.cacheManager.set(cacheKey, user, this.CACHE_TTL);
      }
      // If email is being updated, check for uniqueness
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email }
        });

        if (existingUser) {
          throw new ConflictException('Email already exists');
        }
      }
      console.log(updateUserDto, "update user dto 1122")
      // If password is being updated, hash it
      if (updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
        updateUserDto.password = hashedPassword;
      }

      console.log(updateUserDto, "33444 update user dto")

      // Merge the update DTO with existing user
      const updatedUser = this.userRepository.merge(user, updateUserDto);
      console.log(updateUserDto, "44444444")

      // Save the updated user
      const savedUser = await this.userRepository.save(updatedUser);
      console.log(savedUser, "saved user")

      // Clear all related caches
      await this.clearUserRelatedCaches(
        identifier,
        updateUserDto.email || savedUser.email
      );

      // Return the updated user mapped to the DTO
      return this.mapUserToDto(savedUser);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }


  // Delete a user by email or id
  async deleteUser(identifier: string): Promise<void> {
    try {
      // Find the user by email or id
      const user = await this.findUserByIdentifier(identifier);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Remove the user from the database
      await this.userRepository.remove(user);

      // Clear all related caches
      await this.clearUserRelatedCaches(identifier, user.email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting user');
    }
  }
  async createBulkUsers(bulkCreateUsersDto: BulkCreateUsersDto): Promise<BulkOperationResponseDto> {
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    // Validate and preprocess input
    if (!bulkCreateUsersDto.users.length) {
      return results;
    }

    // Check for duplicate emails in input
    const emails = bulkCreateUsersDto.users.map(user => user.email.toLowerCase());
    if (new Set(emails).size !== emails.length) {
      throw new ConflictException('Duplicate emails in request');
    }

    // Batch size optimization
    const BATCH_SIZE = 500;
    const userBatches = this.chunk(bulkCreateUsersDto.users, BATCH_SIZE);

    // Pre-generate password hashes concurrently
    const hashPromises = bulkCreateUsersDto.users.map(user => 
      bcrypt.hash(user.password, 10)
    );
    const hashedPasswords = await Promise.all(hashPromises);
    const passwordMap = new Map(
      bulkCreateUsersDto.users.map((user, index) => [
        user.email, 
        hashedPasswords[index]
      ])
    );

    // Process batches
    for (const batch of userBatches) {
      try {
        await this.processBatch(batch, passwordMap, results);
      } catch (error) {
        this.logger.error(`Batch processing error: ${error.message}`, {
          batch: batch.length,
          error
        });
        throw new InternalServerErrorException('Bulk creation failed');
      }
    }

    return results;
  }

  private async processBatch(
    batch: CreateUserDto[], 
    passwordMap: Map<string, string>, 
    results: BulkOperationResponseDto
  ): Promise<void> {
    const batchEmails = batch.map(user => user.email.toLowerCase());
    
    // Check existing users in single query
    const existingUsers = await this.userRepository.find({
      where: { email: In(batchEmails) },
      select: ['email']
    });

    if (existingUsers.length) {
      throw new ConflictException(
        `Emails already exist: ${existingUsers.map(u => u.email).join(', ')}`
      );
    }

    // Prepare batch insert data
    const users = batch.map(dto => ({
      ...dto,
      email: dto.email.toLowerCase(),
      password: passwordMap.get(dto.email),
      isVerified: false,
      walletBalance: 0,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Perform batch insert
    await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();

    results.successful += batch.length;
  }

  async updateBulkUsers(
    bulkUpdateUsersDto: BulkUpdateUsersDto
  ): Promise<BulkOperationResponseDto> {
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    // Process updates in chunks
    const CHUNK_SIZE = 100;
    const updateChunks = this.chunk(bulkUpdateUsersDto.updates, CHUNK_SIZE);

    for (const updateChunk of updateChunks) {
      await this.userRepository.manager.transaction(async transactionalEntityManager => {
        for (const { identifier, data } of updateChunk) {
          try {
            const user = await this.findUserByIdentifier(identifier);
            if (!user) {
              results.failed++;
              results.errors.push({
                identifier,
                error: 'User not found',
              });
              continue;
            }

            if (data.password) {
              const salt = await bcrypt.genSalt();
              data.password = await bcrypt.hash(data.password, salt);
            }

            Object.assign(user, data);
            await transactionalEntityManager.save(user);
            results.successful++;

            await this.clearUserRelatedCaches(user.id.toString(), user.email);
          } catch (error) {
            results.failed++;
            results.errors.push({
              identifier,
              error: error.message,
            });
          }
        }
      });
    }

    return results;
  }

  async deleteBulkUsers(bulkDeleteUsersDto: BulkDeleteUsersDto): Promise<void> {
    const CHUNK_SIZE = 100;
    const identifierChunks = this.chunk(bulkDeleteUsersDto.identifiers, CHUNK_SIZE);

    for (const identifierChunk of identifierChunks) {
      await this.userRepository.manager.transaction(async transactionalEntityManager => {
        for (const identifier of identifierChunk) {
          const user = await this.findUserByIdentifier(identifier);
          if (user) {
            await transactionalEntityManager.remove(user);
            await this.clearUserRelatedCaches(user.id.toString(), user.email);
          }
        }
      });
    }
  }

  private async findUserByIdentifier(identifier: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: [
        { id: Number(identifier) },
        { email: identifier },
      ],
    });
  }

  // Helper function for chunking arrays
  private chunk<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, (i + size))
    );
  }

}