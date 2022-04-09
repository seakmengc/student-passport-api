import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import {
  ResetPassword,
  ResetPasswordSchema,
} from './entities/reset-password.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../auth/services/jwt-config.service';
import { NotificationProxy } from 'src/common/providers/notification-proxy.provider';
import { User, UserSchema } from '../user/entities/user.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: ResetPassword.name, schema: ResetPasswordSchema },
      { name: User.name, schema: UserSchema },
    ]),
    EmailModule,
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, JwtConfigService],
})
export class ResetPasswordModule {}
