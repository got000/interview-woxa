import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { refreshToken: jest.Mock };

  beforeEach(async () => {
    authService = { refreshToken: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('refreshToken', () => {
    it('delegates to AuthService.refreshToken with the refresh token', async () => {
      const result = { accessToken: 'new-token' };
      authService.refreshToken.mockResolvedValue(result);

      await expect(
        controller.refreshToken({ refresh_token: 'old-token' }),
      ).resolves.toBe(result);
      expect(authService.refreshToken).toHaveBeenCalledWith('old-token');
    });
  });
});
