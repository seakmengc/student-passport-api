import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { Email, EmailSchema } from './entities/email.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
