import { config } from 'dotenv';
import { UserSeeder } from './user.seed';
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { resolve } from 'path';
import { EmailSeeder } from './email.seed';

async function run(): Promise<void> {
  const STORES = {
    EmailSeeder,
    UserSeeder,
  };

  config({
    path: resolve('./', '.env.' + (process.env.NODE_ENV || 'local')),
    override: true,
  });

  await mongoose.connect(process.env.DB_URI);

  const session = await mongoose.startSession();
  session.startTransaction();

  const seeders = process.argv[2]
    ? [STORES[process.argv[2]]]
    : Object.values(STORES);
  for (const classConstructor of seeders) {
    await new classConstructor().run();
  }

  await session.commitTransaction();

  await mongoose.disconnect();

  Logger.log('Finished seeding!', 'Seeder');
}

run();
