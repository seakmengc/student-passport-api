import { Role } from 'src/modules/user/entities/user.entity';
import { UserFactory } from '../factories/user.factory';
import faker from '@faker-js/faker';
import mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { Student } from 'src/modules/user/entities/student.entity';

export class UserSeeder {
  public async run(): Promise<void> {
    await new UserFactory(faker).clear();

    await this.seedSuperAdminUsers();

    await new UserFactory(faker).createMany(
      (process.env.NODE_ENV ?? 'local') !== 'local' ? 100 : 30,
    );

    Logger.log('Finished seeding!', 'User Seeder');
  }

  private async seedSuperAdminUsers() {
    await Promise.all([
      new UserFactory(faker).create({
        email: 'c.seakmeng0603@gmail.com',
        role: Role.SUPER_ADMIN,
      }),
      new UserFactory(faker).create({
        email: 'piustudentpassport@gmail.com',
        role: Role.ADMIN,
      }),
      new UserFactory(faker).create({
        email: 'raymondc0603@gmail.com',
        role: Role.STUDENT,
        student: new Student(),
      }),
    ]);
  }
}
