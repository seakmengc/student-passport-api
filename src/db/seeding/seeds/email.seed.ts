import { config } from 'dotenv';
import { Role } from 'src/modules/user/entities/user.entity';
import { UserFactory } from '../factories/user.factory';
import faker from '@faker-js/faker';
import mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { Email, EmailSchema } from 'src/modules/email/entities/email.entity';

export class EmailSeeder {
  private EmailModel: mongoose.Model<mongoose.Document<Email>>;

  constructor() {
    this.EmailModel = mongoose.model(Email.name, EmailSchema);
  }

  protected data = [
    {
      name: 'welcome',
      subject: 'Welcome to Student Passport!',
      header: 'Hi "{{name}}"',
      subheader: 'Welcome to Student Passport!',
      body: 'We are pleased to have you here and can not wait to explore the offices with you!',
      footer: 'Go to your profile now and check it out!',
      img: 'images/email/notification-bookmark.png',
    },
    {
      name: 'password.forgot',
      subject: 'Reset Password',
      header: 'Reset Password',
      subheader: "We've have requested for a password reset.",
      body: '<p style="font-size: 27px; color: #9155FD; margin-bottom: 30px">CODE: {{otp}}</p>',
      img: '/images/email/user-reset-password.png',
      footer:
        'If you did not request for a reset, you can safely ignore this email.',
    },
    {
      name: 'email.verification',
      subject: 'Reset Password',
      header: 'Hi "{{name}}"',
      subheader: 'Verify Your Email Account',
      body: '<p>Thanks for joining with us. Please type in the code below to continue:</p><p style="font-size: 27px; color: #9155FD; margin-bottom: 30px">CODE: {{otp}}</p>',
      img: '/images/email/user-account.png',
    },
    {
      name: 'stamp.received',
      subject: 'New Achievement',
      header: 'Hi "{{name}}"',
      subheader: 'Your afford pays off!',
      body: 'Congratulations! You have received a stamp from <b>{{officeName}}</b>.',
      footer: 'Go to your profile now and check it out!',
      img: '/images/email/user-welcome.png',
    },
    {
      name: 'quest.rejected',
      subject: 'Quest Rejection',
      header: 'Hi "{{name}}"',
      body: 'We feel sorry to say that your submitted quest has been rejected under the reason "{{reason}}".',
      footer: 'Head to your profile now and resubmit it again!',
      img: '/images/email/user-welcome.png',
    },
  ];

  public async run(): Promise<void> {
    await this.EmailModel.deleteMany({});
    await this.EmailModel.create(
      this.data.map((each) => ({
        ...each,
        img: process.env.FRONTEND_URL + each.img,
      })),
    );

    Logger.log('Finished seeding!', 'Email Seeder');
  }
}
