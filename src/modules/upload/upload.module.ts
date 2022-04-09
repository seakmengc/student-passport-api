import { User, UserSchema } from 'src/modules/user/entities/user.entity';
import { UploadController } from './upload.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { Upload, UploadSchema } from './entities/upload.entity';
import { LocalStorage } from './storages/local.storage';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Upload.name, schema: UploadSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  providers: [UploadService, LocalStorage],
  controllers: [UploadController],
})
export class UploadModule {}
