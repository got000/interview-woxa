import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { ChangeUserPasswordInput, GetUserInput, UserInput } from './inputs';
import { User } from './../../config/decorators/user.decorator';
import { IUserInSession } from './../../config/decorators/decorator.inteface';
import { AuthGuard } from './../../config/guard/auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id') userId: string) {
    return await this.usersService.getUser(userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(@Query() query: GetUserInput) {
    return await this.usersService.getUsers(query);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id') userId: string,
    @Body() payload: UserInput,
    @User() user: IUserInSession,
  ) {
    return await this.usersService.updateUser(userId, payload, user?._id);
  }

  @Put(':id/update-password')
  @UseGuards(AuthGuard)
  async updatePassword(
    @Param('id') userId: string,
    @Body() payload: ChangeUserPasswordInput,
    @User() user: IUserInSession,
  ) {
    return await this.usersService.updatePassword(userId, payload, user?._id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') userId: string, @User() user: IUserInSession) {
    return await this.usersService.deleteUser(userId, user?._id);
  }
}
