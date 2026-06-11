import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenInput } from './inputs';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh-token')
  async refreshToken(@Body() payload: RefreshTokenInput) {
    return await this.authService.refreshToken(payload.refresh_token);
  }
}
