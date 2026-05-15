import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type JwtUser = { userId: string };

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): JwtUser => {
  const request = ctx.switchToHttp().getRequest<{ user?: JwtUser }>();
  const user = request.user;
  if (!user) {
    throw new Error('CurrentUser used without JwtAuthGuard');
  }
  return user;
});
