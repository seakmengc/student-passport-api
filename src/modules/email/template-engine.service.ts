import { SendEmailDto } from './dto/send-email.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { filterXSS } from 'xss';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Email, EmailDocument } from './entities/email.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

type EmailReplacementType = {
  header: string;
  body: string;
  footer: string;

  button?: {
    name: string;

    link: string;
  };
};

@Injectable()
export class TemplateEngineService {
  private layout: string;
  private buttonHtml: string;

  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Email.name)
    private readonly emailModel: mongoose.Model<EmailDocument>,
  ) {
    this.layout = readFileSync('views/layout.html')
      .toString()
      .replace(
        this.createRegex(['logo_url']),
        configService.get('API_GATEWAY_URL') + '/img/logo.png',
      );

    this.buttonHtml = readFileSync('views/templates/button.html').toString();

    this.transporter = nodemailer.createTransport({
      host: configService.get('MAIL_HOST'),
      port: parseInt(configService.get('MAIL_PORT')),
      auth: {
        user: configService.get('MAIL_USER'), // generated ethereal user
        pass: configService.get('MAIL_PASSWORD'), // generated ethereal password
      },
    });

    this.transporter.verify().then((_) => {
      Logger.log('NODEMAILER connection verified!');
    });
  }

  async sendMail(sendEmailDto: SendEmailDto) {
    const email = await this.emailModel.findOne({
      name: sendEmailDto.name,
    });
    if (!email) {
      throw new NotFoundException();
    }

    // send mail with defined transport object
    const info = await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM'),
      to: sendEmailDto.to,
      subject: this.replaceAll(email.subject, sendEmailDto.replacements),
      html: this.render({
        header: this.replaceAll(email.header ?? '', sendEmailDto.replacements),
        body: this.replaceAll(email.body ?? '', sendEmailDto.replacements),
        footer: this.replaceAll(email.footer ?? '', sendEmailDto.replacements),
        button: sendEmailDto.button,
      }),
    });

    return info;
  }

  render(replacements: EmailReplacementType): string {
    const filteredReplacement = {
      header: filterXSS(replacements.header),
      body: filterXSS(replacements.body),
      footer: filterXSS(replacements.footer),
      button_html: '',
    } as Record<string, string>;
    delete filteredReplacement['button'];

    if (replacements.button) {
      filteredReplacement.button_html = this.replaceAll(this.buttonHtml, {
        button_name: replacements.button.name,
        button_link: replacements.button.link,
      });
    }

    return this.replaceAll(this.layout, filteredReplacement);
  }

  private replaceAll(str: string, replacements: Record<string, string>) {
    if (replacements === {}) {
      return str;
    }

    const regex = this.createRegex(Object.keys(replacements));

    return str.replace(
      regex,
      (matched: string) =>
        replacements[matched.substring(2, matched.length - 2)] ?? '',
    );
  }

  private createRegex(keys: string[]): RegExp {
    return new RegExp(keys.map((key) => `{{${key}}}`).join('|'), 'gi');
  }
}
