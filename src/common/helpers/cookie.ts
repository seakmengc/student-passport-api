import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Env } from './env';

export class Cookie {
  static setRefreshTokenCookie(
    configService: ConfigService,
    res: Response,
    key: string,
    value: string,
    expires: Date = null,
  ) {
    res.cookie(key, value, {
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
