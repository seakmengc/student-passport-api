import { ConnectionOptions } from 'typeorm';
import { config } from 'dotenv';
import { Helper } from 'src/common/helper';

config({
  path: Helper.getFullPath('.env.' + (process.env.NODE_ENV || 'local')),
  override: true,
});

const srcDir = __filename.endsWith('.js') ? 'dist/' : 'src/';

export default {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  dropSchema: false,
  migrationsRun: true,
  migrations: [srcDir + 'db/migrations/*{.ts,.js}'],
  entities: [srcDir + 'modules/**/*.entity{.ts,.js}'],
  seeds: [srcDir + 'db/seeding/seeds/*.seed{.ts,.js}'],
  factories: [srcDir + 'db/seeding/factories/**/*{.ts,.js}'],
  cli: {
    migrationsDir: srcDir + 'db/migrations',
    entitiesDir: srcDir + 'modules/**/*.entity.ts',
  },
} as ConnectionOptions;
