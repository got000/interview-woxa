import { Test, TestingModule } from '@nestjs/testing';
import { CryptorService } from './cryptor.service';

describe('CryptorService', () => {
  let service: CryptorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptorService],
    }).compile();

    service = module.get<CryptorService>(CryptorService);
  });

  describe('encryptPassword / verifyPassword', () => {
    it('hashes a password and verifies it successfully', async () => {
      const hash = await service.encryptPassword('Pass@w0rd');

      expect(hash).toEqual(expect.any(String));
      expect(hash).not.toBe('Pass@w0rd');
      await expect(
        service.verifyPassword('Pass@w0rd', hash),
      ).resolves.toBe(true);
    });

    it('rejects verification with the wrong password', async () => {
      const hash = await service.encryptPassword('Pass@w0rd');

      await expect(
        service.verifyPassword('WrongPassword', hash),
      ).resolves.toBe(false);
    });
  });
});
