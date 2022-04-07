import { createHash } from 'crypto';

export class Helper {
  static getSHA2Hash(str: string): string {
    return createHash('sha256').update(str).digest('base64');
  }

  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static getFullPath(relativeToProjectRootPath: string): string {
    return (
      __dirname.split('/').slice(0, -2).join('/') +
      '/' +
      relativeToProjectRootPath
    );
  }
}
