import mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import {
  Upload,
  UploadSchema,
} from 'src/modules/upload/entities/upload.entity';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { Helper } from 'src/common/helper';

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

    await mkdir(Helper.getFullPath('storage/upload'));

    await writeFile(
      Helper.getFullPath('storage/upload/Ov91EtbqOT3yGCFkCdkd4'),
      await readFile(Helper.getFullPath('storage/assets/stamp.png')),
    );

    await this.UploadModel.create(this.data);

    Logger.log('Finished seeding!', 'Uploads Seeder');
  }
}
