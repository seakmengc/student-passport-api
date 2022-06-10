import { QuestSchema } from './../../../modules/quest/entities/quest.entity';
import { OfficeSchema } from './../../../modules/office/entities/office.entity';
import { Role } from 'src/modules/user/entities/user.entity';
import { UserFactory } from '../factories/user.factory';
import faker from '@faker-js/faker';
import mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { Email, EmailSchema } from 'src/modules/email/entities/email.entity';
import { Office } from 'src/modules/office/entities/office.entity';
import { Quest } from 'src/modules/quest/entities/quest.entity';

export class QuestSeeder {
  private QuestModel: mongoose.Model<mongoose.Document<Quest>>;
  private OfficeModel: mongoose.Model<mongoose.Document<Office>>;

  constructor() {
    this.QuestModel = mongoose.model(Quest.name, QuestSchema);
    this.OfficeModel = mongoose.model(Office.name, OfficeSchema);
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
    const unit = await this.OfficeModel.findOne({ parent: { $exists: true } });

    await this.QuestModel.deleteMany({});
    await this.QuestModel.create(
      this.data.map((each) => ({ ...each, office: unit.id })),
    );

    Logger.log('Finished seeding!', 'Quests Seeder');
  }
}
