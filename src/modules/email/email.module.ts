import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { Email, EmailSchema } from './entities/email.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from './email.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
