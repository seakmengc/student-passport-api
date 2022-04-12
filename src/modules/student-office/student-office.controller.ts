import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { StudentOfficeService } from './student-office.service';

@ApiBearerAuth()
@ApiTags('Student Office')
@Controller('student-office')
export class StudentOfficeController {
  constructor(private readonly studentOfficeService: StudentOfficeService) {}

  //get or create
  @Get('office/:officeId')
  firstOrCreate(@Param('officeId') officeId: string, @Req() req) {
    return this.studentOfficeService.firstOrCreate(req.payload.sub, officeId);
  }

  //find offices by student
  @Get('user/:userId')
  findOfficesByStudent(@Param('userId') userId: string) {
    return this.studentOfficeService.findOfficesByStudent(userId);
  }
}
