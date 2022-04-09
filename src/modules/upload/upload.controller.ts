import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthId } from 'src/decorators/auth-id.decorator';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { AllowUnauth } from 'src/decorators/allow-unauth.decorator';

@Controller('upload')
export class UploadController {
  constructor(private service: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1_000_000, //1MB
        files: 1,
      },
    }),
  )
  upload(@AuthId() userId: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException();
    }

    if (
      !file.mimetype.startsWith('image/') &&
      !file.mimetype.startsWith('video/')
    ) {
      throw new BadRequestException('Only image/video formats supported');
    }

    return this.service.upload(userId, file);
  }

  @AllowUnauth()
  @Get(':id/file')
  async getFile(
    @Param('id') id: string,
    @Query('sig') signature: string,
    @Res() res: Response,
  ) {
    this.service.pipeStream(id, signature, res);
  }
}
