import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { UsersService } from './modules/users/users.service';

describe('AppController', () => {
  let appController: AppController;
  let authService: { signIn: jest.Mock };
  let usersService: { createUser: jest.Mock };

  beforeEach(async () => {
    authService = { signIn: jest.fn() };
    usersService = { createUser: jest.fn() };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('signIn', () => {
    it('delegates to AuthService.signIn', async () => {
      const input = { email: 'user@example.com', password: 'password' } as never;
      const req = {} as never;
      const result = { access_token: 'token' };
      authService.signIn.mockResolvedValue(result);

      await expect(appController.signIn(input, req)).resolves.toBe(result);
      expect(authService.signIn).toHaveBeenCalledWith(input, req);
    });
  });

  describe('register', () => {
    it('delegates to UsersService.createUser', async () => {
      const input = {
        email: 'user@example.com',
        password: 'password',
        name: 'User',
      } as never;
      const result = { id: '1' };
      usersService.createUser.mockResolvedValue(result);

      await expect(appController.register(input)).resolves.toBe(result);
      expect(usersService.createUser).toHaveBeenCalledWith(input);
    });
  });
});
