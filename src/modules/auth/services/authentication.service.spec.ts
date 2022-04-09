import { hash } from 'bcryptjs';
import { Helper } from './../../../common/helper';
import { TokenPayload } from './authentication.service';
import { OAuth } from './../entities/oauth.entity';
import { JwtConfigService } from 'modules/auth/services/jwt-config.service';
import { AuthenticationService } from 'modules/auth/services/authentication.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { getMockUser } from 'common/mock/user.mock';
import { User } from 'modules/user/entities/user.entity';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let jwtService: JwtService;
  let jwtConfigService: JwtConfigService;
  let refreshTokenRepo: Repository<RefreshToken>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              secret: configService.get('JWT_SECRET'),
            };
          },
        }),
      ],
      providers: [
        { provide: getRepositoryToken(OAuth), useClass: Repository },
        { provide: getRepositoryToken(RefreshToken), useClass: Repository },
        AuthenticationService,
        JwtConfigService,
      ],
    }).compile();

    refreshTokenRepo = module.get<Repository<RefreshToken>>(
      getRepositoryToken(RefreshToken),
    );
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
    jwtService = module.get<JwtService>(JwtService);
    jwtConfigService = module.get<JwtConfigService>(JwtConfigService);

    const oAuthRepo = module.get<Repository<OAuth>>(getRepositoryToken(OAuth));

    jest.spyOn(oAuthRepo, 'find').mockResolvedValue([]);
    jest
      .spyOn(jwtConfigService, 'createOAuth')
      .mockImplementation((key, type) =>
        Promise.resolve(
          Object.assign(new OAuth(), {
            algo: jwtConfigService.algo,
            key,
            type,
          }),
        ),
      );

    jest
      .spyOn(refreshTokenRepo, 'create')
      .mockImplementation((args) => Object.assign(new RefreshToken(), args));

    jest.spyOn(refreshTokenRepo, 'save').mockImplementation();

    await jwtConfigService.onApplicationBootstrap();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('generateTokens', () => {
    it('should return accessToken and refreshToken when generateTokens', async () => {
      const expectedRefreshToken = 'abc';
      const expectedAccessToken = 'access';
      const user = getMockUser();
      const payload: TokenPayload = { sub: user.id, roleIds: [1] };

      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue(expectedAccessToken);
      jest
        .spyOn(authenticationService, 'generateRefreshToken')
        .mockResolvedValue(expectedRefreshToken);

      const res = await authenticationService.generateTokens(user);

      expect(jwtService.signAsync).toBeCalledTimes(1);
      expect(jwtService.signAsync).toBeCalledWith(
        payload,
        jwtConfigService.createAccessTokenJwtOptions(),
      );

      expect(authenticationService.generateRefreshToken).toBeCalledTimes(1);
      expect(authenticationService.generateRefreshToken).toBeCalledWith(
        user,
        payload,
        expectedAccessToken,
      );

      expect(res.accessToken).toStrictEqual(expectedAccessToken);
      expect(res.refreshToken).toStrictEqual(expectedRefreshToken);
    });
  });

  describe('comparePassword', () => {
    it('should return true on correct comparePassword', async () => {
      const pw = 'password';
      const hashedPw = await hash(pw, 10);

      const correct = await authenticationService.comparePassword(pw, hashedPw);

      expect(correct).toStrictEqual(true);
    });

    it('should return false on incorrect comparePassword', async () => {
      const pw = 'password';
      const incorrectPw = 'password1';
      const hashedPw = await hash(pw, 10);

      const correct = await authenticationService.comparePassword(
        incorrectPw,
        hashedPw,
      );

      expect(correct).toStrictEqual(false);
    });
  });

  describe('verifyAccessToken', () => {
    beforeAll(() => {
      jest.spyOn(jwtService, 'signAsync').mockRestore();
    });

    it('should return payload when access token is valid', async () => {
      const user = getMockUser();

      const generatedTokens = await authenticationService.generateTokens(user);

      const res = await authenticationService.verifyAccessToken(
        generatedTokens.accessToken,
      );

      expect(res.sub).toStrictEqual(user.id);
      expect(res.iss).toStrictEqual(process.env.APP_NAME);
    });

    it('should throw error when access token is expired', async () => {
      expect.assertions(1);

      const user = getMockUser();

      const currOptions = jwtConfigService.createAccessTokenJwtOptions();
      jest
        .spyOn(jwtConfigService, 'createAccessTokenJwtOptions')
        .mockReturnValue({
          ...currOptions,
          expiresIn: '0s',
        });

      const generatedTokens = await authenticationService.generateTokens(user);

      try {
        await authenticationService.verifyAccessToken(
          generatedTokens.accessToken,
        );
      } catch (err) {
        expect(err.message as string).toStrictEqual('jwt expired');
      }
    });

    it('should throw error when access token is invalid', async () => {
      expect.assertions(1);

      try {
        await authenticationService.verifyAccessToken('token');
      } catch (err) {
        expect(err.message as string).toStrictEqual('jwt malformed');
      }
    });
  });

  describe('exchangeRefreshToken', () => {
    let refreshToken: string;
    let userMock: User;
    let hashedRefreshToken: string;
    let expectedTokens: { accessToken: string; refreshToken: string };

    beforeEach(async () => {
      refreshToken = 'token';
      userMock = getMockUser();
      hashedRefreshToken = Helper.getSHA2Hash('token');

      expectedTokens = { accessToken: 'ac', refreshToken: 'rt' };
      jest.spyOn(jwtService, 'verifyAsync').mockImplementation();

      jest.spyOn(refreshTokenRepo, 'findOneOrFail').mockImplementation((_) => {
        return Promise.resolve(
          Object.assign(new RefreshToken(), {
            tokenHash: hashedRefreshToken,
            revokedAt: null,
            user: userMock,
          }),
        );
      });

      jest.spyOn(refreshTokenRepo, 'save').mockImplementation();

      jest
        .spyOn(authenticationService, 'generateTokens')
        .mockResolvedValue(expectedTokens);
    });

    it('should return accessToken and refreshToken when exchangeRefreshToken', async () => {
      const tokens = await authenticationService.exchangeRefreshToken(
        refreshToken,
      );

      expect(tokens).toEqual(expectedTokens);

      expect(refreshTokenRepo.findOneOrFail).toBeCalledTimes(1);
    });

    it('should revoked old refresh token after exchangeRefreshToken', async () => {
      const tokens = await authenticationService.exchangeRefreshToken(
        refreshToken,
      );

      expect(refreshTokenRepo.save).toBeCalledTimes(1);
      expect(refreshTokenRepo.save).toBeCalledWith({
        tokenHash: hashedRefreshToken,
        revokedAt: expect.anything(),
        replacedByTokenHash: Helper.getSHA2Hash(tokens.refreshToken),
        user: userMock,
      });
    });

    it('should throw error when refresh token is invalid', async () => {
      expect.assertions(1);

      jest.spyOn(refreshTokenRepo, 'findOneOrFail').mockImplementation((_) => {
        return Promise.reject('not found');
      });

      try {
        await authenticationService.exchangeRefreshToken(refreshToken);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('generateRefreshToken', () => {
    it('should return refreshToken when generateRefreshToken', async () => {
      const accessToken = 'access';
      const user = getMockUser();
      const payload: TokenPayload = { sub: user.id, roleIds: [] };
      const expectedRefreshToken = 'abc';

      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue(expectedRefreshToken);

      jest.spyOn(authenticationService, 'generateRefreshToken').mockRestore();

      const refreshToken = await authenticationService.generateRefreshToken(
        user,
        payload,
        accessToken,
      );

      expect(refreshToken).toStrictEqual(expectedRefreshToken);

      expect(jwtService.signAsync).toBeCalledTimes(1);
      expect(jwtService.signAsync).toBeCalledWith(
        expect.objectContaining(payload),
        jwtConfigService.createRefreshTokenJwtOptions(),
      );

      expect(refreshTokenRepo.create).toBeCalledTimes(1);
      expect(refreshTokenRepo.create).toBeCalledWith({
        user,
        accessTokenHash: Helper.getSHA2Hash(accessToken),
        tokenHash: Helper.getSHA2Hash(refreshToken),
      });

      expect(refreshTokenRepo.save).toBeCalledTimes(1);
    });
  });
});
