import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    getHashPassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const mockCreatedUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        fullname: 'Test User',
        role: 'Learner',
        message: 'OK',
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockUsersService.create.mockResolvedValue(mockCreatedUser);

      const result = await authService.register({
        email: 'test@example.com',
        password: '123456',
        username: 'testuser',
        fullname: 'Test User',
      });

      expect(result).toMatchObject({
        message: ['User registered successfully'],
        id: expect.any(Number),
        email: 'test@example.com',
        username: 'testuser',
        fullname: 'Test User',
        role: 'Learner',
      });
    });

    it('should throw if email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 1 });

      await expect(
        authService.register({
          email: 'test@example.com',
          password: '123456',
          username: 'testuser',
          fullname: 'Test User',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return access_token if login is valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        role: 'Learner',
        password_hash: '$2b$10$fakehashhashhashhashhashhashhashhash',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.getHashPassword.mockResolvedValue(
        mockUser.password_hash,
      );
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      mockJwtService.sign.mockReturnValue('test-token');

      const result = await authService.login({
        email: 'test@example.com',
        password: '123456',
      });

      expect(result).toEqual({
        message: ['Login successful'],
        access_token: 'test-token',
      });
    });

    it('should throw if email not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'no@email.com', password: 'pass' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        role: 'Learner',
        password_hash: '$2b$10$fakehash',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.getHashPassword.mockResolvedValue(
        mockUser.password_hash,
      );
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrongpass' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('forgotPassword', () => {
    it('should throw if passwords do not match', async () => {
      await expect(
        authService.forgotPassword({
          email: 'test@example.com',
          newPassword: '123456',
          confirmPassword: '654321',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if email not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.forgotPassword({
          email: 'notfound@example.com',
          newPassword: '123456',
          confirmPassword: '123456',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update password successfully', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'oldhash',
      };
      mockUsersService.findByEmail.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue({
        ...user,
        password_hash: 'newhash',
      });
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'newhash');

      const result = await authService.forgotPassword({
        email: 'test@example.com',
        newPassword: '123456',
        confirmPassword: '123456',
      });

      expect(result).toEqual({
        message: ['Password changed successfully'],
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...user,
        password_hash: 'newhash',
      });
    });
  });
});
