import { User, UserSchema } from 'src/modules/user/entities/user.entity';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './entities/refresh-token.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtConfigService } from './services/jwt-config.service';
import { AuthenticationService } from './services/authentication.service';
import { NotificationProxy } from 'src/common/providers/notification-proxy.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtConfigService,
    AuthenticationService,
    NotificationProxy.register(),
  ],
})
export class AuthModule {}
