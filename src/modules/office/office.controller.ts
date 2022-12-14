import { PaginationDto } from './../../common/dto/pagination.dto';
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
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { Office } from './entities/office.entity';
import { OfficePolicy } from './office.policy';
import { AuthPayload } from 'src/decorators/auth-payload.decorator';

@Controller('office')
export class OfficeController {
  constructor(
    private readonly officeService: OfficeService,
    private readonly officePolicy: OfficePolicy,
  ) {}

  @Post()
  async create(
    @Body() createOfficeDto: CreateOfficeDto,
    @AuthPayload() payload,
  ) {
    await this.officePolicy.superAdminOrOfficeAdmin(
      payload,
      createOfficeDto.parent,
    );

    return this.officeService.create(createOfficeDto);
  }

  @ApiOkResponse({ type: Office, isArray: true })
  @Get()
  async findAll(
    @Query('onlyHasUnits') onlyHasUnits: boolean,
    @Query('populate') populate: string,
  ) {
    return this.officeService.findAll(onlyHasUnits, populate ?? '');
  }

  @ApiOkResponse({ type: Office, isArray: true })
  @Get('/ids')
  async findOfficesByIdsWithStamps(@Query('ids') id: string) {
    const ids = id?.split(',') ?? [];

    return this.officeService.findByIdsWithStamps(ids);
  }

  @ApiOkResponse({ type: Office, isArray: true })
  @Get('/unit')
  async findAllUnits() {
    return this.officeService.findAllUnits();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const office = await this.officeService
      .findOne(id)
      .populate('admins stamp')
      .populate('parent', 'admins');

    return {
      ...office.toJSON(),
      children: await this.officeService.findChildren(office.id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOfficeDto: UpdateOfficeDto,
    @AuthPayload() payload,
  ) {
    await this.officePolicy.superAdminOrOfficeAdmin(payload, id);

    return this.officeService.update(id, updateOfficeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @AuthPayload() payload) {
    await this.officePolicy.superAdminOrOfficeAdmin(payload, id);

    return this.officeService.remove(id);
  }
}
