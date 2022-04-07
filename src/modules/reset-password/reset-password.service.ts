import { Model } from 'mongoose';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { randomInt } from 'crypto';
import { Helper } from 'src/common/helper';
import { User, UserDocument } from '../user/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ResetPassword,
  ResetPasswordDocument,
} from './entities/reset-password.entity';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationProxy } from 'src/common/providers/notification-proxy.provider';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ResetPasswordService {
  private readonly hashRound: number = 10;

  constructor(
    @Inject(NotificationProxy.providerName)
    private readonly notiProxy: ClientProxy,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ResetPassword.name)
    private resetPasswordModel: Model<ResetPasswordDocument>,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      where: { email: forgotPasswordDto.email },
      select: ['id', 'recoveryEmail'],
    });

    if (!user || !user.recoveryEmail) {
      throw new BadRequestException(
        "Your account don't have recovery email for resetting password.",
      );
    }

    const otp = randomInt(100000, 999999);

    //send email with token
    this.notiProxy
      .send('email.send', {
        name: 'password.forgot',
        to: user.recoveryEmail,
        replacements: {
          otp: otp,
        },
      })
      .subscribe();

    const token = await hash(otp.toString(), this.hashRound);

    const dataToSet = {
      userId: user.id,
      token: token,
      //1 hour
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    };

    await this.resetPasswordModel.findOneAndRemove({ userId: user.id });

    await this.resetPasswordModel.create(dataToSet);
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const resetPw = await this.resetPasswordModel.findOne({
      relations: ['user'],
      where: {
        user: { email: verifyOtpDto.email },
      },
    });
    if (!resetPw) {
      throw new BadRequestException('OTP is invalid.');
    }

    const correct = await compare(verifyOtpDto.otp.toString(), resetPw.token);
    if (!correct) {
      throw new BadRequestException('OTP is invalid.');
    }

    return resetPw.token;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const resetPw = await this.resetPasswordModel.findOne({
      where: { token: resetPasswordDto.token },
    });

    if (!resetPw || resetPw.expiresAt.getTime() < new Date().getTime()) {
      await Helper.sleep(randomInt(300, 500));
      throw new BadRequestException('OTP is invalid or expired.');
    }

    await this.userModel.updateOne(
      {
        id: resetPw.user,
      },
      { password: await hash(resetPasswordDto.newPassword, this.hashRound) },
    );

    await resetPw.remove();
  }
}
