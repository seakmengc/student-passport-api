import { StudentQuest } from './entities/student-quest.entity';
import { Quest } from 'src/modules/quest/entities/quest.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { StudentQuestService } from './student-quest.service';
import { CreateStudentQuestDto } from './dto/create-student-quest.dto';
import { HasAnyRole } from 'src/decorators/has-any-role.decorator';
import { Role } from '../user/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApproveStudentQuestDto } from './dto/approve-student-quest.dto';
import { StudentQuestPolicy } from './student-quest.policy';
import { AuthPayload } from 'src/decorators/auth-payload.decorator';

@Controller('student-quest')
export class StudentQuestController {
  constructor(
    private readonly studentQuestService: StudentQuestService,
    private readonly studentQuestPolicy: StudentQuestPolicy,
  ) {}

  //get latest by office
  @HasAnyRole(Role.STUDENT)
  @ApiOkResponse({ type: StudentQuest })
  @Get('office/:officeId/latest')
  getLatestQuest(@Param('officeId') officeId: string, @Req() req) {
    return this.studentQuestService.getLatestQuest(req.payload.sub, officeId);
  }

  //submit by quest
  @HasAnyRole(Role.STUDENT)
  @ApiCreatedResponse({ type: StudentQuest })
  @Post()
  create(@Body() createStudentQuestDto: CreateStudentQuestDto, @Req() req) {
    return this.studentQuestService.create(
      req.payload.sub,
      createStudentQuestDto,
    );
  }

  //admin index all need approval
  @HasAnyRole(Role.ADMIN)
  @Get()
  findAllForApproval(
    @Body() paginationDto: PaginationDto,
    @AuthPayload() payload,
  ) {
    return this.studentQuestService.findAllForApproval(paginationDto, payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentQuestService.findOne(id);
  }

  //admin approve or reject
  @HasAnyRole(Role.ADMIN)
  @Put(':id/approve')
  async approve(
    @Param('id') id: string,
    @Body() approveStudentQuestDto: ApproveStudentQuestDto,
    @Req() req,
    @AuthPayload() payload,
  ) {
    await this.studentQuestPolicy.superAdminOrOfficeAdmin(payload, id);

    return this.studentQuestService.approve(
      req.payload.sub,
      id,
      approveStudentQuestDto,
    );
  }
}
