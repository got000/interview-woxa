import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { bcrypt, bcryptVerify } from 'hash-wasm';

@Injectable()
export class CryptorService {
  async encryptPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16);
    return await bcrypt({
      password,
      salt,
      costFactor: 11,
      outputType: 'encoded',
    });
  }

  async verifyPassword(
    password: string,
    comparePassword: string,
  ): Promise<boolean> {
    return await bcryptVerify({ password, hash: comparePassword });
  }
}
