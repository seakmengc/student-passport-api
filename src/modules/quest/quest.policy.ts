import { Quest } from 'src/modules/quest/entities/quest.entity';
import { TokenPayload } from 'src/modules/auth/services/authentication.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '../user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Office } from '../office/entities/office.entity';

@Injectable()
export class QuestPolicy {
  constructor(
    @InjectModel(Quest.name) private model: mongoose.Model<Quest>,
    @InjectModel(Office.name) private officeModel: mongoose.Model<Office>,
  ) {}

  async superAdminOrOfficeAdmin(authPayload: TokenPayload, officeId?: string) {
    if (authPayload.role === Role.SUPER_ADMIN) {
      return;
    }

    this.throwUnauthorizedUnless(authPayload.role === Role.ADMIN);

    if (officeId) {
      this.throwUnauthorizedUnless(
        (await this.officeModel.exists({
          _id: officeId,
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
