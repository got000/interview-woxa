import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AuthGuard as PassportAuthGuard,
  PassportStrategy,
} from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { StatusEnum } from '../constants';

export type JwtPayload = {
  _id: string;
  email: string;
  role: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const userInDb = await this.usersService.getUserById(
      payload._id?.toString?.() ?? payload._id,
    );

    if (!userInDb || userInDb.is_deleted) {
      throw new UnauthorizedException();
    }

    if (userInDb.status !== StatusEnum.ACTIVE) {
      throw new UnauthorizedException();
    }

    if (userInDb && userInDb.is_deleted) {
      throw new UnauthorizedException();
    }
    return {
      ...userInDb,
      _id: userInDb?._id?.toString?.() ?? userInDb?._id,
    };
  }
}

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {}
