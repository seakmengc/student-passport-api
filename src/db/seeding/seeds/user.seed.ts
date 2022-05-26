import { Role } from 'src/modules/user/entities/user.entity';
import { UserFactory } from '../factories/user.factory';
import faker from '@faker-js/faker';
import mongoose from 'mongoose';
import { Logger } from '@nestjs/common';

export class UserSeeder {
  public async run(): Promise<void> {
    await new UserFactory(faker).clear();

    await this.seedSuperAdminUsers();

    await new UserFactory(faker).createMany(10);

    Logger.log('Finished seeding!', 'User Seeder');
  }

  private async seedSuperAdminUsers() {
    await Promise.all([
      new UserFactory(faker).create({
        email: 'sadmin@example.com',
        // recoveryEmail: 'schheang4@paragoniu.edu.kh',
        role: Role.SUPER_ADMIN,
      }),
      new UserFactory(faker).create({
        email: 'admin@example.com',
        // recoveryEmail: 'schheang4@paragoniu.edu.kh',
        role: Role.ADMIN,
      }),
    ]);
  }
}
