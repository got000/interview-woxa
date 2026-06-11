import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RefreshTokenInput } from './inputs';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh-token')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async refreshToken(@Body() payload: RefreshTokenInput) {
    return await this.authService.refreshToken(payload.refresh_token);
  }
}
