import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { Users } from './schemas/user.schema';
import { CryptorService } from 'src/common/cryptor/cryptor.service';
import { AggregateCommon } from 'src/common/aggregates/aggregate.common';
import { HelperService } from 'src/common/helper/helper.service';

const USER_ID = '507f1f77bcf86cd799439011';
const OTHER_USER_ID = '507f1f77bcf86cd799439099';

function createFindOneResult(doc: Record<string, unknown> | null) {
  const resolved = doc ? { ...doc, toObject: () => doc } : null;
  return {
    orFail: jest.fn((onError: () => never) =>
      resolved ? Promise.resolve(resolved) : Promise.resolve(onError()),
    ),
    then: (resolve: (value: unknown) => unknown) => resolve(resolved),
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let usersModel: {
    findOne: jest.Mock;
    aggregate: jest.Mock;
    countDocuments: jest.Mock;
    create: jest.Mock;
    updateOne: jest.Mock;
  };
  let cryptorService: { encryptPassword: jest.Mock; verifyPassword: jest.Mock };

  beforeEach(async () => {
    usersModel = {
      findOne: jest.fn(),
      aggregate: jest.fn(),
      countDocuments: jest.fn(),
      create: jest.fn(),
      updateOne: jest.fn(),
    };
    cryptorService = {
      encryptPassword: jest.fn().mockResolvedValue('hashed-password'),
      verifyPassword: jest.fn().mockResolvedValue(false),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(Users.name), useValue: usersModel },
        { provide: CryptorService, useValue: cryptorService },
        AggregateCommon,
        HelperService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('returns the user by id excluding deleted users', async () => {
      const user = { _id: USER_ID, email: 'user@example.com' };
      usersModel.findOne.mockResolvedValue(user);

      const response = await service.getUser(USER_ID);

      expect(usersModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ is_deleted: false }),
      );
      expect(response.result).toBe(user);
    });
  });

  describe('getUsers', () => {
    it('returns paginated users', async () => {
      const users = [{ _id: '1' }, { _id: '2' }];
      usersModel.aggregate.mockResolvedValue(users);
      usersModel.countDocuments.mockResolvedValue(12);

      const response = await service.getUsers({ limit: 10, skip: 1, search: '' });

      expect(response.result).toBe(users);
      expect(response.pagination).toEqual({
        current_page: 1,
        total_pages: 2,
        total: 12,
      });
    });
  });

  describe('createUser', () => {
    const payload = {
      full_name: 'New User',
      email: 'new@example.com',
      password: 'Pass@w0rd',
      confirm_password: 'Pass@w0rd',
    };

    it('creates a user when passwords match and the email is free', async () => {
      usersModel.findOne.mockResolvedValue(null);

      const response = await service.createUser(payload);

      expect(cryptorService.encryptPassword).toHaveBeenCalledWith('Pass@w0rd');
      expect(usersModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          full_name: 'New User',
          email: 'new@example.com',
          password: 'hashed-password',
        }),
      );
      expect(response.message).toBe('create user success');
    });

    it('throws when the password and confirmation do not match', async () => {
      await expect(
        service.createUser({ ...payload, confirm_password: 'different' }),
      ).rejects.toThrow();
      expect(usersModel.create).not.toHaveBeenCalled();
    });

    it('throws when the email already exists', async () => {
      usersModel.findOne.mockResolvedValue({ _id: 'existing' });

      await expect(service.createUser(payload)).rejects.toThrow();
      expect(usersModel.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const payload = { full_name: 'Updated Name', email: 'updated@example.com' };

    it('throws when the user does not exist', async () => {
      usersModel.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateUser(USER_ID, payload, OTHER_USER_ID),
      ).rejects.toThrow();
      expect(usersModel.updateOne).not.toHaveBeenCalled();
    });

    it('throws when the new email is taken by another user', async () => {
      usersModel.findOne
        .mockResolvedValueOnce({ _id: USER_ID })
        .mockResolvedValueOnce({ _id: OTHER_USER_ID });

      await expect(
        service.updateUser(USER_ID, payload, OTHER_USER_ID),
      ).rejects.toThrow();
      expect(usersModel.updateOne).not.toHaveBeenCalled();
    });

    it('updates the user when the email is free', async () => {
      usersModel.findOne
        .mockResolvedValueOnce({ _id: USER_ID })
        .mockResolvedValueOnce(null);

      const response = await service.updateUser(USER_ID, payload, OTHER_USER_ID);

      expect(usersModel.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        expect.objectContaining({
          $set: expect.objectContaining(payload),
        }),
      );
      expect(response.message).toBe('update user success');
    });
  });

  describe('deleteUser', () => {
    it('soft-deletes the user', async () => {
      const response = await service.deleteUser(USER_ID, OTHER_USER_ID);

      expect(usersModel.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        expect.objectContaining({
          $set: expect.objectContaining({ is_deleted: true }),
        }),
      );
      expect(response.message).toBe('delete user success');
    });
  });

  describe('validateComparePassword', () => {
    it('returns true when both passwords match', () => {
      expect(service.validateComparePassword('a', 'a')).toBe(true);
    });

    it('returns false when passwords differ', () => {
      expect(service.validateComparePassword('a', 'b')).toBe(false);
    });
  });

  describe('updatePassword', () => {
    const payload = { password: 'NewPass@1', confirm_password: 'NewPass@1' };

    it('throws when the user does not exist', async () => {
      usersModel.findOne.mockReturnValueOnce(createFindOneResult(null));

      await expect(
        service.updatePassword(USER_ID, payload, USER_ID),
      ).rejects.toThrow();
      expect(usersModel.updateOne).not.toHaveBeenCalled();
    });

    it('throws when the password and confirmation do not match', async () => {
      usersModel.findOne.mockReturnValueOnce(
        createFindOneResult({ password: 'old-hash' }),
      );

      await expect(
        service.updatePassword(
          USER_ID,
          { ...payload, confirm_password: 'different' },
          USER_ID,
        ),
      ).rejects.toThrow();
      expect(usersModel.updateOne).not.toHaveBeenCalled();
    });

    it('throws when the new password is the same as the current one', async () => {
      usersModel.findOne.mockReturnValueOnce(
        createFindOneResult({ password: 'old-hash' }),
      );
      cryptorService.verifyPassword.mockResolvedValue(true);

      await expect(
        service.updatePassword(USER_ID, payload, USER_ID),
      ).rejects.toThrow();
      expect(usersModel.updateOne).not.toHaveBeenCalled();
    });

    it('updates the password when valid and different from the current one', async () => {
      usersModel.findOne.mockReturnValueOnce(
        createFindOneResult({ password: 'old-hash' }),
      );
      cryptorService.verifyPassword.mockResolvedValue(false);

      const response = await service.updatePassword(USER_ID, payload, USER_ID);

      expect(usersModel.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        expect.objectContaining({
          $set: expect.objectContaining({ password: 'hashed-password' }),
        }),
      );
      expect(response.message).toBe('change password user success');
    });
  });
});
