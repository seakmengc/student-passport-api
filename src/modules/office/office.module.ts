import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';
import { Office, OfficeSchema } from './entities/office.entity';
import { OfficePolicy } from './office.policy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Office.name, schema: OfficeSchema }]),
  ],
  controllers: [OfficeController],
  providers: [OfficeService, OfficePolicy],
})
export class OfficeModule {}
