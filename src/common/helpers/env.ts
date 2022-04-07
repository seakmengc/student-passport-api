import { ConfigService } from '@nestjs/config';

export class Env {
  static isInLocal(configOrEnv: ConfigService | NodeJS.ProcessEnv) {
    return Env.getEnv(configOrEnv) === 'local';
  }

  static isInDev(configOrEnv: ConfigService | NodeJS.ProcessEnv) {
    return ['local', 'dev'].includes(Env.getEnv(configOrEnv));
  }

  static isInProd(configOrEnv: ConfigService | NodeJS.ProcessEnv) {
    return Env.getEnv(configOrEnv) === 'production';
  }

  static getEnv(configOrEnv: ConfigService | NodeJS.ProcessEnv): string {
    return (
      (configOrEnv instanceof ConfigService
        ? configOrEnv.get('APP_ENV')
        : configOrEnv.APP_ENV) ||
      process.env.NODE_ENV ||
      'local'
    );
  }
}
