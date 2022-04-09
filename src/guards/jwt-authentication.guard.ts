import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import {
  AuthenticationService,
  TokenPayload,
} from 'src/modules/auth/services/authentication.service';

@Injectable()
export class JwtAuthenticationGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  constructor(
    private authenticationService: AuthenticationService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    if (
      this.reflector.getAllAndOverride<boolean>('allowUnauth', [
        context.getHandler(),
        context.getClass(),
      ])
    ) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!bearerToken) {
      throw new UnauthorizedException();
    }

    return this.authenticationService
      .verifyAccessToken(bearerToken)
      .then((payload: TokenPayload) => {
        req.payload = payload;

        return true;
      })
      .catch((_): never => {
        throw new UnauthorizedException();
      });
  }
}
