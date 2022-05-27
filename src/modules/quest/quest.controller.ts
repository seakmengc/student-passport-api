import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuestService } from './quest.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { QuestPolicy } from './quest.policy';
import { AuthPayload } from 'src/decorators/auth-payload.decorator';

@ApiBearerAuth()
@ApiTags('Quest')
@Controller('quest')
export class QuestController {
  constructor(
    private readonly questService: QuestService,
    private readonly questPolicy: QuestPolicy,
  ) {}

  @Post()
  async create(@Body() createQuestDto: CreateQuestDto, @AuthPayload() payload) {
    await this.questPolicy.superAdminOrOfficeAdmin(
      payload,
      createQuestDto.office,
    );

    return this.questService.create(createQuestDto);
  }

  @Get('/office/:officeId')
  findByOffice(@Param('officeId') officeId: string) {
    return this.questService.findByOffice(officeId);
  }

  @Get('/ids')
  findByIds(@Query('ids') ids: string) {
    const arrIds = ids.split(',');

    return this.questService.findByIds(arrIds);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto,
    @AuthPayload() payload,
  ) {
    await this.questPolicy.superAdminOrOfficeAdmin(
      payload,
      (
        await this.questService.findOne(id, { office: true })
      ).office as unknown as string,
    );

    return this.questService.update(id, updateQuestDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @AuthPayload() payload) {
    await this.questPolicy.superAdminOrOfficeAdmin(
      payload,
      (
        await this.questService.findOne(id, { office: true })
      ).office as unknown as string,
    );

    return this.questService.remove(id);
  }
}
