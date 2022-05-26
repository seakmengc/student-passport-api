import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Upload, UploadDocument } from './entities/upload.entity';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { LocalStorage } from './storages/local.storage';
import { nanoid } from 'nanoid/async';
import { Response } from 'express';
import { AuthenticationService } from '../auth/services/authentication.service';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    private storage: LocalStorage,
    private authenticationService: AuthenticationService,
    private configService: ConfigService,
  ) {}

  async upload(userId: string, file: Express.Multer.File) {
    const filePath = `/upload/${await nanoid()}`;

    await this.storage.putFile(filePath, file.buffer);

    const upload = await this.uploadModel.create({
      user: userId,
      mimeType: file.mimetype,
      name: file.originalname,
      path: filePath,
      size: file.size,
    });

    const sig = await this.authenticationService.generateSignatureForUpload(
      upload.id,
    );

    return {
      ...upload.toJSON(),
      url: `${this.configService.get('APP_URL')}/upload/${
        upload.id
      }/file?sig=${sig}`,
    };
  }

  async pipeStream(id: string, signature: string, res: Response) {
    console.log(id, signature);

    await this.verifySignature(signature, id);

    const upload = await this.uploadModel
      .findById(id, {
        id: true,
        path: true,
        mimeType: true,
        name: true,
      })
      .orFail();

    const readStream = await this.storage.getFile(upload.path);

    res.writeHead(200, {
      'Content-Type': upload.mimeType,
    });

    readStream.pipe(res);
  }

  private async verifySignature(signature: string, shouldHaveScope: string) {
    try {
      const payload = await this.authenticationService.verifySignature(
        signature,
      );

      const haveScope = (payload.scp as string)
        .toString()
        .split(' ')
        .includes(shouldHaveScope.toString());

      if (!haveScope) {
        throw new ForbiddenException();
      }
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  // remove() {}
}
