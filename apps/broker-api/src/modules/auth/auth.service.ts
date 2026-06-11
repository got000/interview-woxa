import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInInput } from './inputs';
import { throwHttpException } from './../../config/filters/http-error.exception.filter';
import { ERROR_MESSAGES, StatusEnum } from './../../config/constants';
import { CryptorService } from 'src/common/cryptor/cryptor.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptorService: CryptorService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(payload: SignInInput, req: any) {
    const jwtPayload = {
      _id: req?.user?._id,
      email: payload.username,
    };

    const access_token = this.jwtService.sign(jwtPayload);

    return {
      access_token,
      ...req?.user,
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.getUserByUsername(username);
    if (!user?.password) return null;

    const verify = await this.cryptorService.verifyPassword(
      password,
      user?.password,
    );

    if (verify) {
      return {
        _id: user?._id?.toString(),
        email: user?.email,
        status: user?.status,
        full_name: user?.full_name,
        is_deleted: user?.is_deleted,
      };
    }

    return null;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const user = await this.usersService.getUserByUsername(decoded.email);

      if (!user) {
        throwHttpException(ERROR_MESSAGES.UNAUTHORIZED);
      }

      if (user && user.status === StatusEnum.INACTIVE) {
        throwHttpException(ERROR_MESSAGES.CREDENTIAL_INVALID);
      }

      if (user?.is_deleted) {
        throwHttpException(ERROR_MESSAGES.UNAUTHORIZED);
      }

      const jwtPayload = {
        _id: user?._id?.toString(),
        email: user?.email,
      };

      const accessToken = this.jwtService.sign(jwtPayload, {
        expiresIn: process.env.JWT_EXPIRES_IN as any,
      });

      return { accessToken };
    } catch (error) {
      console.error('Error while doing something:', error);
      throw error;
    }
  }
}
