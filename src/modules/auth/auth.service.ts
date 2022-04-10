import { BadRequestException, Injectable } from '@nestjs/common';
import { Helper } from 'src/common/helper';
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
    private authenticationService: AuthenticationService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel
      .findOne(
        {
          email: loginDto.email,
        },
        { _id: true, password: true },
      )
      .orFail();

    if (
      !(await this.authenticationService.comparePassword(
        loginDto.password,
        user.password,
      ))
    ) {
      throw new BadRequestException('Wrong email or password.');
    }

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
