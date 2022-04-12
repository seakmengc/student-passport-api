import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { Quest, QuestSchema } from './entities/quest.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quest.name, schema: QuestSchema }]),
  ],
  controllers: [QuestController],
  providers: [QuestService],
})
export class QuestModule {}
