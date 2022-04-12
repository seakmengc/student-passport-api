import { Module } from '@nestjs/common';
import { StudentOfficeService } from './student-office.service';
import { StudentOfficeController } from './student-office.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quest, QuestSchema } from '../quest/entities/quest.entity';
import {
  StudentOffice,
  StudentOfficeSchema,
} from './entities/student-office.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentOffice.name, schema: StudentOfficeSchema },
      { name: Quest.name, schema: QuestSchema },
    ]),
  ],
  controllers: [StudentOfficeController],
  providers: [StudentOfficeService],
})
export class StudentOfficeModule {}
