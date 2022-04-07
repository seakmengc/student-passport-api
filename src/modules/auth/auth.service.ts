import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Helper } from 'src/common/helper';
import { NotificationProxy } from 'src/common/providers/notification-proxy.provider';
import { User, UserDocument } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthenticationService } from './services/authentication.service';
import { ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @Inject(NotificationProxy.providerName)
    private readonly notiProxy: ClientProxy,
    private authenticationService: AuthenticationService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      where: { email: loginDto.email },
      select: ['id', 'password'],
    });

    if (
      !user ||
      !(await this.authenticationService.comparePassword(
        loginDto.password,
        user.password,
      ))
    ) {
      throw new BadRequestException('Wrong email or password.');
    }

    this.notiProxy
      .send('pushNotification.send', {
        userId: user.id,
        type: 'newLogin',
        title: 'Login Detected',
        body: "Someone just logged in to your account. Please have your password reset if it's not you.",
        params: {
          qp: '',
        },
      })
      .subscribe();

    return this.authenticationService.generateTokens(user);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    if (!refreshTokenDto.refreshToken) {
      throw new BadRequestException('Refresh token is required.');
    }

    return this.authenticationService.exchangeRefreshToken(
      refreshTokenDto.refreshToken,
    );
  }

  logout(req: any) {
    const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const hash = Helper.getSHA2Hash(bearerToken);

    return this.authenticationService.logout(hash);
  }
}
