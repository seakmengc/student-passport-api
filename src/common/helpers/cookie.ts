import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';
import { Env } from './env';

export class Cookie {
  static setRefreshTokenCookie(
    configService: ConfigService,
    res: FastifyReply,
    key: string,
    value: string,
    expires: Date = null,
  ) {
    res.setCookie(key, value, {
      expires,
      signed: true,
      sameSite: 'strict',
      httpOnly: true,
      secure: !Env.isInLocal(configService),
      path:
        (Env.isInLocal(configService) ? '' : '/ams') + '/auth/refresh-token',
    });
  }
}
