import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserInSession } from './decorator.inteface';

export const User = createParamDecorator(
  (data: keyof IUserInSession | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const user = (req.user ?? req.session?.user) as IUserInSession | undefined;
    if (!data) return user;
    return user ? user[data] : undefined;
  },
);
