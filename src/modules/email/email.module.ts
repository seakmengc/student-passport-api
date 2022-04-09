import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { Email, EmailSchema } from './entities/email.entity';
import { EmailMessage } from './email.message';
import { TemplateEngineService } from './template-engine.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
  ],
  controllers: [EmailController, EmailMessage],
  providers: [EmailService, TemplateEngineService],
})
export class EmailModule {}
