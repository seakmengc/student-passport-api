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

@ApiBearerAuth()
@ApiTags('Quest')
@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Post()
  create(@Body() createQuestDto: CreateQuestDto) {
    return this.questService.create(createQuestDto);
  }

  @Get()
  findAll() {
    return this.questService.findAll();
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
  update(@Param('id') id: string, @Body() updateQuestDto: UpdateQuestDto) {
    return this.questService.update(id, updateQuestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questService.remove(id);
  }
}
