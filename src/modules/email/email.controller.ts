import { S2S } from '../../decorators/s2s.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TemplateEngineService } from './template-engine.service';
import { Email } from './entities/email.entity';
import { CreateEmailDto } from './dto/create-email.dto';
import {
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateEmailDto } from './dto/update-email.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';

@Controller('email')
@S2S()
@ApiTags('Email S2S')
@ApiBasicAuth()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly templateEngineService: TemplateEngineService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: Email })
  async create(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.create(createEmailDto);
  }

  @Patch('/by-name')
  @ApiCreatedResponse({ type: Email })
  async update(@Body() updateEmailDto: UpdateEmailDto) {
    return this.emailService.update(updateEmailDto);
  }

  @Post('/upsert')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async upsert(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.upsert(createEmailDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async remove(@Query('name') name: string) {
    await this.emailService.remove(name);
  }

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
  @S2S(false)
  testView() {
    const content = this.templateEngineService.render({
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
