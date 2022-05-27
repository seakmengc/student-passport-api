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
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.officeService.findAll(paginationDto);
  }

  @ApiOkResponse({ type: Office, isArray: true })
  @Get('/unit')
  async findAllUnits(@Query() paginationDto: PaginationDto) {
    return this.officeService.findAllUnits(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const office = await this.officeService
      .findOne(id)
      .populate('admins stamp');

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
