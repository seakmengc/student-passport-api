import { Quest } from 'src/modules/quest/entities/quest.entity';
import { TokenPayload } from 'src/modules/auth/services/authentication.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '../user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Office } from '../office/entities/office.entity';
import { StudentQuest } from './entities/student-quest.entity';

@Injectable()
export class StudentQuestPolicy {
  constructor(
    @InjectModel(Quest.name) private questModel: mongoose.Model<Quest>,
    @InjectModel(StudentQuest.name)
    private studentQuestModel: mongoose.Model<StudentQuest>,
    @InjectModel(Office.name) private officeModel: mongoose.Model<Office>,
  ) {}

  async superAdminOrOfficeAdmin(
    authPayload: TokenPayload,
    studentQuestId?: string,
  ) {
    if (authPayload.role === Role.SUPER_ADMIN) {
      return;
    }

    this.throwUnauthorizedUnless(authPayload.role === Role.ADMIN);

    if (!studentQuestId) {
      this.throwUnauthorized();
    }

    const studentQuest = await this.studentQuestModel
      .findById(studentQuestId, { _id: 1 })
      .populate('office', 'parent');

    if (!studentQuest) {
      this.throwUnauthorized();
    }

    this.throwUnauthorizedUnless(
      (await this.officeModel.exists({
        _id: studentQuest.office.id,
        admins: authPayload.sub,
      })) !== null,
    );
  }

  protected throwUnauthorized() {
    throw new UnauthorizedException();
  }

  protected throwUnauthorizedUnless(allow: boolean) {
    if (!allow) {
      throw new UnauthorizedException();
    }
  }
}
