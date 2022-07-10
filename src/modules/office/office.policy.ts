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
      const res = await this.isAdminOf(authPayload.sub, officeId);
      if (res.allow) {
        return;
      }

      if (res.office?.parent === null) {
        this.throwUnauthorized();
      }

      const resParent = await this.isAdminOf(
        authPayload.sub,
        res.office?.parent.id,
      );

      if (!resParent.allow) {
        this.throwUnauthorized();
      }
    }
  }

  protected async isAdminOf(userId: string, officeId: string) {
    const office = await this.model.findById(officeId, {
      parent: 1,
      admins: 1,
    });

    return {
      allow: office.admins.find((user) => user.id === userId) !== null,
      office: office,
    };
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
