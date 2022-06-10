import { Upload } from 'src/modules/upload/entities/upload.entity';
import { UploadSchema } from './../../../modules/upload/entities/upload.entity';
import { QuestSchema } from './../../../modules/quest/entities/quest.entity';
import { OfficeSchema } from './../../../modules/office/entities/office.entity';
import { Role, User, UserSchema } from 'src/modules/user/entities/user.entity';
import { UserFactory } from '../factories/user.factory';
import faker from '@faker-js/faker';
import mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { Email, EmailSchema } from 'src/modules/email/entities/email.entity';
import { Office } from 'src/modules/office/entities/office.entity';
import { Quest } from 'src/modules/quest/entities/quest.entity';

export class StudentQuestSeeder {
  private OfficeModel: mongoose.Model<mongoose.Document<Office>>;
  private UploadModel: mongoose.Model<mongoose.Document<Upload>>;
  private UserModel: mongoose.Model<mongoose.Document<User>>;

  constructor() {
    this.OfficeModel = mongoose.model(Office.name, OfficeSchema);
    this.UploadModel = mongoose.model(Upload.name, UploadSchema);
    this.UserModel = mongoose.model(User.name, UserSchema);
  }

  protected data = [
    {
      quest: 'Where is the office of Student Service?',
      questType: 'mcq',
      isActive: true,
      autoGrading: true,
      order: 1,
      possibleAnswers: [
        {
          correct: true,
          answer: '2nd Floor',
        },
        {
          correct: false,
          answer: '3th Floor',
        },
        {
          correct: false,
          answer: '4th Floor',
        },
        {
          correct: false,
          answer: '5th Floor',
        },
      ],
    },
    {
      quest:
        'Upload a selfie of you in front of the Office of Student Service.',
      questType: 'media',
      isActive: true,
      autoGrading: false,
      order: 2,
    },
    {
      quest: 'What do you know about Student Service?',
      questType: 'input',
      isActive: true,
      autoGrading: true,
      order: 3,
    },
  ];

  public async run(): Promise<void> {
    const offices = await this.OfficeModel.find();

    await Promise.all(
      (
        await this.UserModel.find({ role: Role.STUDENT }).limit(20).exec()
      ).map((user: any) => {
        user.student.officesCompleted = offices.map((office) => office.id);

        return user.save();
      }),
    );

    Logger.log('Finished seeding!', 'Student Quests Seeder');
  }
}
