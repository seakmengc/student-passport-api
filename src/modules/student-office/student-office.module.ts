import { AuthModule } from './../auth/auth.module';
import { LeaderboardService } from './../leaderboard/leaderboard.service';
import { LeaderboardModule } from './../leaderboard/leaderboard.module';
import { User, UserSchema } from 'src/modules/user/entities/user.entity';
import {
  Office,
  OfficeSchema,
} from 'src/modules/office/entities/office.entity';
import { Module } from '@nestjs/common';
import { StudentOfficeService } from './student-office.service';
import { StudentOfficeController } from './student-office.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quest, QuestSchema } from '../quest/entities/quest.entity';
import {
  StudentOffice,
  StudentOfficeSchema,
} from './entities/student-office.entity';
import { AuthenticationService } from '../auth/services/authentication.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentOffice.name, schema: StudentOfficeSchema },
      { name: Quest.name, schema: QuestSchema },
      { name: Office.name, schema: OfficeSchema },
      { name: User.name, schema: UserSchema },
    ]),
    LeaderboardModule,
    EmailModule,
  ],
  controllers: [StudentOfficeController],
  providers: [StudentOfficeService, LeaderboardService],
  exports: [StudentOfficeService, LeaderboardService],
})
export class StudentOfficeModule {}
