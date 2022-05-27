import { Quest } from 'src/modules/quest/entities/quest.entity';
import { TokenPayload } from 'src/modules/auth/services/authentication.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '../user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Office } from '../office/entities/office.entity';

@Injectable()
export class StudentQuestPolicy {
  constructor(
    @InjectModel(Quest.name) private questModel: mongoose.Model<Quest>,
    @InjectModel(Office.name) private officeModel: mongoose.Model<Office>,
  ) {}

  async superAdminOrOfficeAdmin(authPayload: TokenPayload, questId?: string) {
    if (authPayload.role === Role.SUPER_ADMIN) {
      return;
    }

    this.throwUnauthorizedUnless(authPayload.role === Role.ADMIN);

    if (questId) {
      const quest = await this.questModel.findById(questId, { office: 1 });

      this.throwUnauthorizedUnless(
        (await this.officeModel.exists({
          _id: quest.office,
          admins: authPayload.sub,
        })) === null,
      );
    }
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
