import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { randomInt } from 'crypto';

@Injectable()
export class S2sGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    const wantToCheck =
      this.reflector.getAllAndOverride<boolean>('s2s', [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    if (!wantToCheck) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    if (req.headers.token !== this.configService.get('SERVICE_TOKEN')) {
      return new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(false), randomInt(300, 500)),
      );
    }

    return true;
  }
}
