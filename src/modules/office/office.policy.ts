import { TokenPayload } from 'src/modules/auth/services/authentication.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Office } from './entities/office.entity';
import { Role } from '../user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class OfficePolicy {
  constructor(
    @InjectModel(Office.name) private model: mongoose.Model<Office>,
  ) {}

  async superAdminOrOfficeAdmin(authPayload: TokenPayload, officeId?: string) {
    if (authPayload.role === Role.SUPER_ADMIN) {
      return;
    }

    this.throwUnauthorizedUnless(authPayload.role === Role.ADMIN);

    if (officeId) {
      this.throwUnauthorizedUnless(
        (await this.model.exists({
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
