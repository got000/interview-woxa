import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { AuthService } from 'src/modules/auth/auth.service';
import { SignInInput } from 'src/modules/auth/inputs';
import { ERROR_MESSAGES } from '../constants/error-message.constant';
import { StatusEnum } from '../constants';
import { throwHttpException } from './../filters/http-error.exception.filter';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // REST request
    if (!request) return true;

    const input: SignInInput = request.body;
    const path = request?.path;
    const locations = path?.split('/');
    const frontend_location = locations?.[1] ?? '';
    await this.validateInput(input);

    if (!frontend_location) {
      throwHttpException(ERROR_MESSAGES.LOGIN_FAILED);
      return false;
    }

    const user = await this.authService.validateUser(
      input.username,
      input.password,
    );

    if (!user) {
      throwHttpException(ERROR_MESSAGES.CREDENTIAL_INVALID);
      return false;
    }

    request.user = { ...user, _id: user?._id?.toString() };

    if (user && user.status === StatusEnum.INACTIVE) {
      throwHttpException(ERROR_MESSAGES.LOGIN_FAILED);
      return false;
    }

    if (user && user.is_deleted) {
      throwHttpException(ERROR_MESSAGES.LOGIN_FAILED);
      return false;
    }

    return true;
  }

  private async validateInput(input: SignInInput) {
    const signInInput = plainToInstance(SignInInput, input);
    try {
      await validateOrReject(signInInput);
    } catch (errors) {
      const result = (errors as ValidationError[])
        .map((error) =>
          error?.constraints ? Object.values(error.constraints).join(', ') : '',
        )
        .filter(Boolean)
        .join(', ');

      if (result?.includes('email')) {
        throw new BadRequestException(ERROR_MESSAGES.EMAIL_INVALID);
      }
      throw new BadRequestException(result);
    }
  }
}
