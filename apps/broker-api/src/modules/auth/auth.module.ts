import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { CommonModule } from './../../common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IJwtEnv } from './../../common/environments/environment.interface';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './../../config/guard/auth.guard';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { JWT_SECRET, JWT_EXPIRES_IN } =
          configService.getOrThrow<IJwtEnv>('jwt');

        return {
          secret: JWT_SECRET,
          signOptions: { expiresIn: JWT_EXPIRES_IN as any },
        };
      },
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
