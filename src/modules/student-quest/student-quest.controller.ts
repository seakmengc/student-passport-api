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

@Controller('student-quest')
export class StudentQuestController {
  constructor(private readonly studentQuestService: StudentQuestService) {}

  //get latest by office
  @ApiOkResponse({ type: StudentQuest })
  @Get('office/:officeId/latest')
  getLatestQuest(@Param('officeId') officeId: string, @Req() req) {
    return this.studentQuestService.getLatestQuest(req.payload.sub, officeId);
  }

  //submit by quest
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
  findAllForApproval(@Body() paginationDto: PaginationDto) {
    return this.studentQuestService.findAllForApproval(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentQuestService.findOne(id);
  }

  //admin approve or reject
  @HasAnyRole(Role.ADMIN)
  @Put(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() approveStudentQuestDto: ApproveStudentQuestDto,
    @Req() req,
  ) {
    return this.studentQuestService.approve(
      req.payload.sub,
      id,
      approveStudentQuestDto,
    );
  }
}
