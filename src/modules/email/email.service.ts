import { UpdateEmailDto } from './dto/update-email.dto';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { CreateEmailDto } from './dto/create-email.dto';
import { Email, EmailDocument } from './entities/email.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    @InjectModel(Email.name)
    private readonly emailModel: mongoose.Model<EmailDocument>,
  ) {}

  create(createEmailDto: CreateEmailDto) {
    return this.emailModel.create(createEmailDto);
  }

  update(updateEmailDto: UpdateEmailDto) {
    return this.emailModel.updateOne(
      {
        name: updateEmailDto.name,
      },
      updateEmailDto,
    );
  }

  async upsert(createEmailDto: CreateEmailDto) {
    return this.emailModel.updateOne(
      {
        name: createEmailDto.name,
      },
      createEmailDto,
    );
  }

  remove(name: string) {
    return this.emailModel.deleteOne({ name });
  }
}
