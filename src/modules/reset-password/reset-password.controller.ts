import { Controller, Post, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AllowUnauth } from 'src/decorators/allow-unauth.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordService } from './reset-password.service';

@Controller('auth')
@AllowUnauth()
@ApiTags('Forgot Password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('/forgot-password')
  @ApiCreatedResponse()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    console.log(forgotPasswordDto);

    await this.resetPasswordService.forgotPassword(forgotPasswordDto);

    return {
      message: 'Reset password otp has been sent to your recovery email.',
    };
  }

  @Post('/forgot-password/verify-otp')
  @ApiCreatedResponse()
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const token = await this.resetPasswordService.verifyOtp(verifyOtpDto);

    return {
      token: token,
    };
  }

  @Post('/reset-password')
  @ApiCreatedResponse()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.resetPasswordService.resetPassword(resetPasswordDto);

    return {
      message: 'Password has been reset.',
    };
  }
}
