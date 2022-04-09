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
      name: 'password.forgot',
      subject: 'Password Reset',
      header: 'You have requested for a password reset.',
      body: 'Please type in OTP below: <br><h2>{{otp}}</h2>',
      footer:
        'If you did not request for a reset, you can safely ignore this email.',
    },
  ];

  public async run(): Promise<void> {
    await this.EmailModel.create(this.data);

    Logger.log('Finished seeding!', 'Email Seeder');
  }
}
