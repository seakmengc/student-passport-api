import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { JwtConfigService } from './jwt-config.service';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../entities/refresh-token.entity';
import { User, UserDocument } from 'src/modules/user/entities/user.entity';
import { Helper } from 'src/common/helper';
import { ApiProperty } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface TokenPayload {
  sub: string;
  role: string;
}

export class LoggedInResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private jwtConfigService: JwtConfigService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async generateTokens(user: User): Promise<LoggedInResponse> {
    const payload: TokenPayload = {
      sub: user._id,
      role: user.role,
    };

    const accessToken = await this.generateAccessToken(payload);

    const refreshToken = await this.generateRefreshToken(
      user,
      payload,
      accessToken,
    );

    return { accessToken, refreshToken };
  }

  async comparePassword(plain: string, hash: string) {
    return compare(plain, hash);
  }

  async verifyAccessToken(bearerToken: string) {
    return this.jwtService.verifyAsync(
      bearerToken,
      this.jwtConfigService.createAccessTokenJwtVerifyOptions(),
    );
  }

  async verifySignature(signature: string) {
    return this.jwtService.verifyAsync(
      signature,
      this.jwtConfigService.createSignatureVerifyOptions(),
    );
  }

  async exchangeRefreshToken(refreshToken: string) {
    try {
      await this.jwtService.verifyAsync(
        refreshToken,
        this.jwtConfigService.createRefreshTokenJwtVerifyOptions(),
      );
    } catch (err) {
      throw new BadRequestException('Session is expired.');
    }

    const model = await this.refreshTokenModel
      .findOne({
        tokenHash: Helper.getSHA2Hash(refreshToken),
        revokedAt: null,
      })
      .populate('user')
      .orFail();

    const tokens = await this.generateTokens(model.user as User);

    model.replacedByTokenHash = Helper.getSHA2Hash(tokens.refreshToken);
    model.revokedAt = new Date();
    await model.save();

    return tokens;
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.signAsync(
      payload,
      this.jwtConfigService.createAccessTokenJwtOptions(),
    );
  }

  async generateRefreshToken(
    user: User,
    payload: TokenPayload,
    accessToken: string,
  ): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      payload,
      this.jwtConfigService.createRefreshTokenJwtOptions(),
    );

    try {
      await this.refreshTokenModel.create({
        user: user,
        accessTokenHash: Helper.getSHA2Hash(accessToken),
        tokenHash: Helper.getSHA2Hash(refreshToken),
      });
    } catch (err) {
      //token generated with same payload at the same second produces same token
      Logger.debug('Found same token.');

      throw new InternalServerErrorException('Error generating token.');
    }

    return refreshToken;
  }

  async generateSignatureForUpload(uploadId: string) {
    const signature = await this.jwtService.signAsync(
      { scp: uploadId.toString() },
      this.jwtConfigService.createSignatureJwtOptions(),
    );

    return signature;
  }

  async generateSignatureForUploads(uploadIds: string[]) {
    const signature = await this.jwtService.signAsync(
      { scp: uploadIds.join(' ') },
      this.jwtConfigService.createSignatureJwtOptions(),
    );

    return signature;
  }

  logout(accessTokenHash: string) {
    return this.refreshTokenModel.deleteOne({
      accessTokenHash: accessTokenHash,
    });
  }
}
