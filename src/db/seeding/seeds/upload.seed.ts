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
import {
  Upload,
  UploadSchema,
} from 'src/modules/upload/entities/upload.entity';
import { readFile, writeFile } from 'fs/promises';

export class UploadSeeder {
  private UploadModel: mongoose.Model<mongoose.Document<Upload>>;

  constructor() {
    this.UploadModel = mongoose.model(Upload.name, UploadSchema);
  }

  protected data = {
    mimeType: 'image/png',
    name: 'stamp.png',
    size: 123,
    user: '6299d00207dbf0cab7bcf0fb',
    completed: true,
    path: '/upload/Ov91EtbqOT3yGCFkCdkd4',
  };

  public async run(): Promise<void> {
    await this.UploadModel.deleteMany({});
    await writeFile(
      'storage/upload/Ov91EtbqOT3yGCFkCdkd4',
      await readFile('storage/public/img/stamp.png'),
    );

    await this.UploadModel.create(this.data);

    Logger.log('Finished seeding!', 'Uploads Seeder');
  }
}
