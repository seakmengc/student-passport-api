import { FastifyReply, FastifyRequest } from 'fastify';
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
import { Authenticated } from 'src/decorators/authenticated.decorator';
import { S2S } from 'src/decorators/s2s.decorator';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
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
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() loginDto: LoginDto,
  ) {
    const tokens = await this.authService.login(loginDto);

    Cookie.setRefreshTokenCookie(
      this.configService,
      res,
      'rt',
      tokens.refreshToken,
    );

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
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    if (refreshTokenDto == null) {
      refreshTokenDto = new RefreshTokenDto();
      if (!req.cookies.rt) {
        throw new BadRequestException('Refresh token is required.');
      }

      refreshTokenDto.refreshToken = req.unsignCookie(req.cookies.rt).value;
    }

    const tokens = await this.authService.refreshToken(refreshTokenDto);

    Cookie.setRefreshTokenCookie(
      this.configService,
      res,
      'rt',
      tokens.refreshToken,
    );

    return tokens;
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  async me(@Authenticated() user) {
    return user;
  }

  @Delete('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async logout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    await this.authService.logout(req);

    //clear cookie
    Cookie.setRefreshTokenCookie(this.configService, res, 'rt', '', new Date());
  }

  @Get('/public-key')
  @AllowUnauth()
  @S2S()
  async getPublicKey() {
    const jwtConfigService = this.moduleRef.get(JwtConfigService);

    return {
      key: jwtConfigService.publicKey,
      algo: jwtConfigService.algo,
    };
  }
}
