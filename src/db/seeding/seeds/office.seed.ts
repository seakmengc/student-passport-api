import { OfficeSchema } from './../../../modules/office/entities/office.entity';
import { Role, User, UserSchema } from 'src/modules/user/entities/user.entity';
import { UserFactory } from '../factories/user.factory';
import faker from '@faker-js/faker';
import mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { Email, EmailSchema } from 'src/modules/email/entities/email.entity';
import { Office } from 'src/modules/office/entities/office.entity';
import {
  Upload,
  UploadSchema,
} from 'src/modules/upload/entities/upload.entity';

export class OfficeSeeder {
  private OfficeModel: mongoose.Model<mongoose.Document<Office>>;
  private UploadModel: mongoose.Model<mongoose.Document<Upload>>;
  private UserModel: mongoose.Model<mongoose.Document<User>>;

  constructor() {
    this.OfficeModel = mongoose.model(Office.name, OfficeSchema);
    this.UploadModel = mongoose.model(Upload.name, UploadSchema);
    this.UserModel = mongoose.model(User.name, UserSchema);
  }

  protected offices = [
    {
      name: 'Student Service',
      hasUnits: true,
      description:
        '{"time":1654349828786,"blocks":[{"id":"ncXTKjS5tm","type":"paragraph","data":{"text":"asdasd"}},{"id":"dnqFA6yH2Z","type":"paragraph","data":{"text":"asd"}}],"version":"2.24.3"}',
    },
    {
      name: 'IT Service',
      hasUnits: false,
      description:
        '{"time":1654349828786,"blocks":[{"id":"ncXTKjS5tm","type":"paragraph","data":{"text":"asdasd"}},{"id":"dnqFA6yH2Z","type":"paragraph","data":{"text":"asd"}}],"version":"2.24.3"}',
    },
    {
      name: 'IT Service 2',
      hasUnits: false,
      description:
        '{"time":1654349828786,"blocks":[{"id":"ncXTKjS5tm","type":"paragraph","data":{"text":"asdasd"}},{"id":"dnqFA6yH2Z","type":"paragraph","data":{"text":"asd"}}],"version":"2.24.3"}',
    },
    {
      name: 'IT Service 3',
      hasUnits: false,
      description:
        '{"time":1654349828786,"blocks":[{"id":"ncXTKjS5tm","type":"paragraph","data":{"text":"asdasd"}},{"id":"dnqFA6yH2Z","type":"paragraph","data":{"text":"asd"}}],"version":"2.24.3"}',
    },
  ];

  protected units = [
    {
      name: 'Unit 1',
      description:
        '{"time":1654349828786,"blocks":[{"id":"ncXTKjS5tm","type":"paragraph","data":{"text":"asdasd"}},{"id":"dnqFA6yH2Z","type":"paragraph","data":{"text":"asd"}}],"version":"2.24.3"}',
    },
    {
      name: 'Unit 2',
      description:
        '{"time":1654349828786,"blocks":[{"id":"ncXTKjS5tm","type":"paragraph","data":{"text":"asdasd"}},{"id":"dnqFA6yH2Z","type":"paragraph","data":{"text":"asd"}}],"version":"2.24.3"}',
    },
  ];

  public async run(): Promise<void> {
    await this.OfficeModel.deleteMany({});
    const stamp = await this.UploadModel.findOne();
    const admin = await this.UserModel.findOne({
      email: 'piustudentpassport@gmail.com',
    });
    const parent = (
      await this.OfficeModel.create(
        this.offices.map((office) => ({
          ...office,
          stamp: stamp.id,
          admins: [admin.id],
        })),
      )
    )[0];

    await this.OfficeModel.create(
      this.units.map((unit) => ({
        ...unit,
        parent: parent._id,
        stamp: stamp.id,
      })),
    );

    Logger.log('Finished seeding!', 'Office Seeder');
  }
}
