import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from './dto/send-email.dto';
import { TemplateEngineService } from './template-engine.service';

@Controller()
export class EmailMessage {
  constructor(private readonly templateEngineService: TemplateEngineService) {}

  @EventPattern('email.send')
  @ApiOkResponse()
  async getNotifications(
    @Payload() sendEmailDto: SendEmailDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      await this.templateEngineService.sendMail(sendEmailDto);

      context.getChannelRef().ack(context.getMessage());

      Logger.log(`SENT: mail ${sendEmailDto.name}`);
    } catch (err) {
      Logger.error(JSON.stringify(err));
    }
  }
}
