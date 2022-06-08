import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AllowUnauth } from './decorators/allow-unauth.decorator';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('healthcheck')
  @AllowUnauth()
  healthcheck(): string {
    return 'OK.';
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  testUpload(@UploadedFile() file: Express.Multer.File, @Body() body) {
    return { file, body };
  }
}
