import { ModuleRef } from '@nestjs/core';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Scope,
} from '@nestjs/common';
import { ApiBasicAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { AllowUnauth } from 'src/decorators/allow-unauth.decorator';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';

@AllowUnauth()
@ApiTags('Email S2S')
@Controller({
  path: 'email',
})
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private moduleRef: ModuleRef,
  ) {}

  @Post('/send')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('Message Queue')
  @ApiNoContentResponse({
    description: 'This is just a sample request params for email.send pattern.',
  })
  async testSendEmail(@Body() sendEmailDto: SendEmailDto) {
    // console.log(sendEmailDto);
    // const info = await this.templateEngineService.sendMail(sendEmailDto);
    // return info;
  }

  @Get('view')
  async testView() {
    const content = (await this.moduleRef.create(EmailService)).render({
      // header: 'This is header',
      // subheader: 'Verify Your Email Account',
      // body: 'This is body',
      // footer: 'This is footer',
      // img: 'http://weekly.grapestheme.com/notify/img/hero-img/blue/heroFill/user-account.png',
      // button: {
      //   name: 'Test',
      //   link: '/',
      // },

      // header: 'Reset Password',
      // subheader: "We've have requested for a password reset.",
      // body: '<p style="font-size: 27px; color: #9155FD; margin-bottom: 30px">CODE: {{otp}}</p>',
      // img: 'http://weekly.grapestheme.com/notify/img/hero-img/blue/heroFill/user-account.png',
      // footer:
      //   'If you did not request for a reset, you can safely ignore this email.',

      // header: 'Hi "{{name}}"',
      // subheader: 'Verify Your Email Account',
      // body: '<p>Thanks for joining with us. Please type in the code below to continue:</p><p style="font-size: 27px; color: #9155FD; margin-bottom: 30px">CODE: {{otp}}</p>',
      // img: 'http://weekly.grapestheme.com/notify/img/hero-img/blue/heroFill/user-account.png',

      header: 'Hi "{{name}}"',
      subheader: 'Your afford pays off!',
      body: 'Congratulations! You have received a stamp from <b>{{officeName}}</b>.',
      footer: 'Go to your profile now and check it out!',
      img: 'http://weekly.grapestheme.com/notify/img/hero-img/blue/heroFill/user-welcome.png',
    });

    return content;
  }
}
