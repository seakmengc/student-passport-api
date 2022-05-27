import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from 'src/modules/auth/services/authentication.service';

export const AuthPayload = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<TokenPayload> => {
    const request = ctx.switchToHttp().getRequest();

    return request.payload as TokenPayload;
  },
);
