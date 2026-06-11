import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { IUserInSession } from 'src/config/decorators/decorator.inteface';

const CURRENT_USER = { _id: 'user-1' } as IUserInSession;

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    getUser: jest.Mock;
    getUsers: jest.Mock;
    updateUser: jest.Mock;
    updatePassword: jest.Mock;
    deleteUser: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      getUser: jest.fn(),
      getUsers: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('delegates to UsersService.getUser', async () => {
      const result = { result: { _id: 'user-1' } };
      usersService.getUser.mockResolvedValue(result);

      await expect(controller.getUser('user-1')).resolves.toBe(result);
      expect(usersService.getUser).toHaveBeenCalledWith('user-1');
    });
  });

  describe('getUsers', () => {
    it('delegates to UsersService.getUsers with the query', async () => {
      const query = { limit: 10, skip: 1 };
      const result = { result: [] };
      usersService.getUsers.mockResolvedValue(result);

      await expect(controller.getUsers(query)).resolves.toBe(result);
      expect(usersService.getUsers).toHaveBeenCalledWith(query);
    });
  });

  describe('updateUser', () => {
    it('delegates to UsersService.updateUser with the current user id', async () => {
      const payload = { full_name: 'New Name', email: 'new@example.com' };
      const result = { message: 'update user success' };
      usersService.updateUser.mockResolvedValue(result);

      await expect(
        controller.updateUser('user-1', payload, CURRENT_USER),
      ).resolves.toBe(result);
      expect(usersService.updateUser).toHaveBeenCalledWith(
        'user-1',
        payload,
        CURRENT_USER._id,
      );
    });
  });

  describe('updatePassword', () => {
    it('delegates to UsersService.updatePassword with the current user id', async () => {
      const payload = { password: 'New@1234', confirm_password: 'New@1234' };
      const result = { message: 'change password user success' };
      usersService.updatePassword.mockResolvedValue(result);

      await expect(
        controller.updatePassword('user-1', payload, CURRENT_USER),
      ).resolves.toBe(result);
      expect(usersService.updatePassword).toHaveBeenCalledWith(
        'user-1',
        payload,
        CURRENT_USER._id,
      );
    });
  });

  describe('deleteUser', () => {
    it('delegates to UsersService.deleteUser with the current user id', async () => {
      const result = { message: 'delete user success' };
      usersService.deleteUser.mockResolvedValue(result);

      await expect(
        controller.deleteUser('user-1', CURRENT_USER),
      ).resolves.toBe(result);
      expect(usersService.deleteUser).toHaveBeenCalledWith(
        'user-1',
        CURRENT_USER._id,
      );
    });
  });
});
