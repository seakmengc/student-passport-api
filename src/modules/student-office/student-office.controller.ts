import { Role } from 'src/modules/user/entities/user.entity';
import { StudentOffice } from 'src/modules/student-office/entities/student-office.entity';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { StudentOfficeService } from './student-office.service';
import { HasAnyRole } from 'src/decorators/has-any-role.decorator';
import { AuthId } from 'src/decorators/auth-id.decorator';

@ApiBearerAuth()
@ApiTags('Student Office')
@HasAnyRole(Role.STUDENT)
@Controller('student-office')
export class StudentOfficeController {
  constructor(private readonly studentOfficeService: StudentOfficeService) {}

  //get or create
  @Get('office/:officeId')
  firstOrCreate(@Param('officeId') officeId: string, @Req() req) {
    return this.studentOfficeService.firstOrCreate(req.payload.sub, officeId);
  }

  @Get()
  findAll(@AuthId() userId: string, @Query('officeIds') officeId: string) {
    const officeIds = officeId?.split(',');

    return this.studentOfficeService.findAll(userId, officeIds);
  }

  //find offices by student
  @ApiOkResponse({ type: StudentOffice, isArray: true })
  @Get('user/:userId')
  findOfficesByStudent(@Param('userId') userId: string) {
    return this.studentOfficeService.findOfficesByStudent(userId);
  }
}
