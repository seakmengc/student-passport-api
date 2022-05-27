import { OfficeSchema } from './../office/entities/office.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { Quest, QuestSchema } from './entities/quest.entity';
import { QuestPolicy } from './quest.policy';
import { Office } from '../office/entities/office.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quest.name, schema: QuestSchema },
      { name: Office.name, schema: OfficeSchema },
    ]),
  ],
  controllers: [QuestController],
  providers: [QuestService, QuestPolicy],
})
export class QuestModule {}
