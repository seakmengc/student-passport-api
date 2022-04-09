import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';
import { promisify } from 'util';
import { generateKeyPair } from 'crypto';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

@Injectable()
export class JwtConfigService implements OnModuleInit {
  public algo: Algorithm = 'RS256';
  public publicKey: string;
  public privateKey: string;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    Logger.log('onModuleInit', 'JwtConfigService');

    await this.generateKeysIfNotExists();

    Logger.log('onModuleInit ended', 'JwtConfigService');
  }

  createSignatureJwtOptions(): JwtSignOptions {
    return {
      algorithm: 'HS256',
      expiresIn: '1d',
      notBefore: 0,
      secret: this.configService.get('APP_SECRET'),
    };
  }

  createSignatureVerifyOptions(): JwtVerifyOptions {
    return {
      algorithms: ['HS256'],
      secret: this.configService.get('APP_SECRET'),
    };
  }

  createAccessTokenJwtOptions(): JwtSignOptions {
    return {
      algorithm: this.algo,
      expiresIn: '1h',
      notBefore: 0,
      privateKey: this.privateKey,
    };
  }

  createAccessTokenJwtVerifyOptions(): JwtVerifyOptions {
    return {
      algorithms: [this.algo],
      ignoreExpiration: false,
      ignoreNotBefore: false,
      publicKey: this.publicKey,
    };
  }

  createRefreshTokenJwtOptions(): JwtSignOptions {
    return {
      algorithm: this.algo,
      privateKey: this.privateKey,
      expiresIn: '30d',
      notBefore: 0,
    };
  }

  createRefreshTokenJwtVerifyOptions(): JwtVerifyOptions {
    return {
      algorithms: [this.algo],
      ignoreExpiration: false,
      ignoreNotBefore: false,
      publicKey: this.privateKey,
    };
  }

  async generateKeysIfNotExists() {
    if (this.privateKey && this.publicKey) {
      return;
    }

    try {
      const [privateBuf, publicBuf] = await Promise.all([
        readFile(resolve('./', 'storage/private.key')),
        readFile(resolve('./', 'storage/public.key')),
      ]);
      this.privateKey = privateBuf.toString();
      this.publicKey = publicBuf.toString();

      return;
    } catch (err) {
      Logger.error(err);
    }

    const response = await promisify(generateKeyPair)('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    this.privateKey = response.privateKey;
    this.publicKey = response.publicKey;

    await Promise.all([
      writeFile(resolve('./', 'storage/public.key'), response.publicKey),
      writeFile(resolve('./', 'storage/private.key'), response.privateKey),
    ]);

    Logger.log('Generated new key pair.');
  }
}
