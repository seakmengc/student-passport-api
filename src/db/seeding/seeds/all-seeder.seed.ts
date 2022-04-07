import { Logger } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export class AllSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.transaction(async () => {});

    Logger.log('Finished seeding!', 'Seeder');
  }
}
