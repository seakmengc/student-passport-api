import { Response, Request } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Cookie } from 'src/common/helpers/cookie';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoggedInResponse } from './services/authentication.service';
import { JwtConfigService } from './services/jwt-config.service';
import { AllowUnauth } from 'src/decorators/allow-unauth.decorator';
import * as passport from 'passport';
import { UserService } from '../user/user.service';
import { AuthId } from 'src/decorators/auth-id.decorator';
import { AuthPayload } from 'src/decorators/auth-payload.decorator';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly moduleRef: ModuleRef,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Logged In.', type: LoggedInResponse })
  @ApiBadRequestResponse({
    description: 'Wrong username or password.',
  })
  @AllowUnauth()
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    passport.authenticate('jwt', (...args) => {
      console.log('jwt', args);
    });

    const tokens = await this.authService.login(loginDto);

    return tokens;
  }

  @Post('refresh-token')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Refreshed.', type: LoggedInResponse })
  @ApiBadRequestResponse({
    description: 'Invalid or refresh token is required.',
  })
  @AllowUnauth()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const tokens = await this.authService.refreshToken(refreshTokenDto);

    return tokens;
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  async me(@AuthId() userId: string) {
    const auth = await this.userService.findOne(userId);

    await auth.setProfileUrl(this.authService.authenticationService);

    return {
      ...auth.toJSON(),
      admins:
        auth.role === 'Admin'
          ? await this.userService.getMyOfficeIds(auth.id)
          : undefined,
    };
  }

  @Get('me/fields')
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  async meByFields(@AuthId() userId: string, @Req() req: Request) {
    const auth = await this.userService.findOne(
      userId,
      req.query.fields?.toString()?.split(','),
    );

    return auth;
  }

  @Get('me/role')
  @ApiBearerAuth()
  async myRole(@AuthPayload() payload) {
    return {
      role: payload.role,
    };
  }

  @Delete('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req);

    //clear cookie
    Cookie.setRefreshTokenCookie(this.configService, res, 'rt', '', new Date());
  }

  @Get('/public-key')
  @AllowUnauth()
  async getPublicKey() {
    const jwtConfigService = this.moduleRef.get(JwtConfigService);

    return {
      key: jwtConfigService.publicKey,
      algo: jwtConfigService.algo,
    };
  }
}
