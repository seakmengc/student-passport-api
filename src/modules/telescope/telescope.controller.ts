import { Controller, Get, Body, Param, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { HasAnyRole } from 'src/decorators/has-any-role.decorator';
import { Role } from '../user/entities/user.entity';
import { TelescopeService } from './telescope.service';

@HasAnyRole(Role.SUPER_ADMIN)
@Controller('telescope')
export class TelescopeController {
  constructor(private readonly telescopeService: TelescopeService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.telescopeService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.telescopeService.findOne(id);
  }
}
