import {
  StudentOffice,
  StudentOfficeSchema,
} from './../student-office/entities/student-office.entity';
import { StudentOfficeService } from './../student-office/student-office.service';
import {
  StudentQuest,
  StudentQuestSchema,
} from './entities/student-quest.entity';
import { Module } from '@nestjs/common';
import { StudentQuestService } from './student-quest.service';
import { StudentQuestController } from './student-quest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quest, QuestSchema } from '../quest/entities/quest.entity';
import { StudentOfficeModule } from '../student-office/student-office.module';
import { Office, OfficeSchema } from '../office/entities/office.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { StudentQuestPolicy } from './student-quest.policy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentQuest.name, schema: StudentQuestSchema },
      { name: StudentOffice.name, schema: StudentOfficeSchema },
      { name: Quest.name, schema: QuestSchema },
      { name: Office.name, schema: OfficeSchema },
      { name: User.name, schema: UserSchema },
    ]),
    StudentOfficeModule,
    EmailModule,
  ],
  controllers: [StudentQuestController],
  providers: [StudentQuestService, StudentOfficeService, StudentQuestPolicy],
})
export class StudentQuestModule {}
