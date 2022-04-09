import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthId = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.payload.sub;
  },
);
