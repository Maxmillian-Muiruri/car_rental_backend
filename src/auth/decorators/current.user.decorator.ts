import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//Unsafe assignment of an `any` value. (@typescript-eslint/no-unsafe-assignment)
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
