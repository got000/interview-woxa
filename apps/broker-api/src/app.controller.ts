import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { UsersService } from './modules/users/users.service';
import { LocalAuthGuard } from './config/guard/local.guard';
import { SignInInput } from './modules/auth/inputs';
import { CreateUserInput } from './modules/users/inputs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async signIn(@Body() input: SignInInput, @Req() req: any) {
    return await this.authService.signIn(input, req);
  }

  @Post('register')
  async register(@Body() input: CreateUserInput) {
    return await this.userService.createUser(input);
  }
}
