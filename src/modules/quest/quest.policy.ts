import { TokenPayload } from 'src/modules/auth/services/authentication.service';
import { Inject, Injectable } from '@nestjs/common';
import { OfficePolicy } from '../office/office.policy';

@Injectable()
export class QuestPolicy {
  constructor(@Inject() private officePolicy: OfficePolicy) {}

  async superAdminOrOfficeAdmin(authPayload: TokenPayload, officeId?: string) {
    this.officePolicy.superAdminOrOfficeAdmin(authPayload, officeId);
  }
}
