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
      header: 'This is header',
      body: 'This is body',
      footer: 'This is footer',
      button: {
        name: 'Test',
        link: '/',
      },
    });

    return content;
  }
}
