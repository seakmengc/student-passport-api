import {
  Upload,
  UploadSchema,
} from 'src/modules/upload/entities/upload.entity';
import { User, UserSchema } from 'src/modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationService } from '../auth/services/authentication.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Upload.name, schema: UploadSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthenticationService],
})
export class UserModule {}
