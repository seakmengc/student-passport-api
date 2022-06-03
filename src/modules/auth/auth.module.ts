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
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Upload, UploadSchema } from '../upload/entities/upload.entity';
import { Office, OfficeSchema } from '../office/entities/office.entity';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Upload.name, schema: UploadSchema },
      { name: Office.name, schema: OfficeSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtConfigService,
    AuthenticationService,
    UserService,
  ],
  exports: [
    AuthenticationService,
    JwtModule,
    JwtConfigService,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
})
export class AuthModule {}
