import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CryptorService } from 'src/common/cryptor/cryptor.service';
import { StatusEnum } from 'src/config/constants';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { getUserByUsername: jest.Mock };
  let cryptorService: { verifyPassword: jest.Mock };
  let jwtService: { sign: jest.Mock; verify: jest.Mock };

  beforeEach(async () => {
    usersService = { getUserByUsername: jest.fn() };
    cryptorService = { verifyPassword: jest.fn() };
    jwtService = { sign: jest.fn(), verify: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: CryptorService, useValue: cryptorService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('signs a JWT and merges the request user', async () => {
      jwtService.sign.mockReturnValue('signed-token');
      const req = { user: { _id: 'user-1', email: 'user@example.com' } };

      const result = await service.signIn(
        { username: 'user@example.com', password: 'secret' },
        req,
      );

      expect(jwtService.sign).toHaveBeenCalledWith({
        _id: 'user-1',
        email: 'user@example.com',
      });
      expect(result).toEqual({
        access_token: 'signed-token',
        _id: 'user-1',
        email: 'user@example.com',
      });
    });
  });

  describe('validateUser', () => {
    it('returns null when the user does not exist', async () => {
      usersService.getUserByUsername.mockResolvedValue(null);

      await expect(
        service.validateUser('user@example.com', 'secret'),
      ).resolves.toBeNull();
    });

    it('returns null when the password does not match', async () => {
      usersService.getUserByUsername.mockResolvedValue({
        password: 'hashed',
      });
      cryptorService.verifyPassword.mockResolvedValue(false);

      await expect(
        service.validateUser('user@example.com', 'wrong'),
      ).resolves.toBeNull();
    });

    it('returns the user profile when the password matches', async () => {
      usersService.getUserByUsername.mockResolvedValue({
        _id: 'user-1',
        email: 'user@example.com',
        status: StatusEnum.ACTIVE,
        full_name: 'User One',
        is_deleted: false,
        password: 'hashed',
      });
      cryptorService.verifyPassword.mockResolvedValue(true);

      const result = await service.validateUser('user@example.com', 'secret');

      expect(result).toEqual({
        _id: 'user-1',
        email: 'user@example.com',
        status: StatusEnum.ACTIVE,
        full_name: 'User One',
        is_deleted: false,
      });
    });
  });

  describe('refreshToken', () => {
    it('issues a new access token for an active user', async () => {
      jwtService.verify.mockReturnValue({ email: 'user@example.com' });
      usersService.getUserByUsername.mockResolvedValue({
        _id: 'user-1',
        email: 'user@example.com',
        status: StatusEnum.ACTIVE,
        is_deleted: false,
      });
      jwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshToken('refresh-token');

      expect(result).toEqual({ accessToken: 'new-access-token' });
    });

    it('throws when the user no longer exists', async () => {
      jwtService.verify.mockReturnValue({ email: 'user@example.com' });
      usersService.getUserByUsername.mockResolvedValue(null);

      await expect(service.refreshToken('refresh-token')).rejects.toThrow();
    });

    it('throws when the user is inactive', async () => {
      jwtService.verify.mockReturnValue({ email: 'user@example.com' });
      usersService.getUserByUsername.mockResolvedValue({
        _id: 'user-1',
        email: 'user@example.com',
        status: StatusEnum.INACTIVE,
        is_deleted: false,
      });

      await expect(service.refreshToken('refresh-token')).rejects.toThrow();
    });

    it('throws when the user is soft-deleted', async () => {
      jwtService.verify.mockReturnValue({ email: 'user@example.com' });
      usersService.getUserByUsername.mockResolvedValue({
        _id: 'user-1',
        email: 'user@example.com',
        status: StatusEnum.ACTIVE,
        is_deleted: true,
      });

      await expect(service.refreshToken('refresh-token')).rejects.toThrow();
    });
  });
});
