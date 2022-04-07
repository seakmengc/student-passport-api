import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @ApiOkResponse({ type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @Get('/create')
  @ApiOkResponse()
  forCreate() {
    return this.service.getForCreate();
  }

  @Get('/header')
  @ApiOkResponse()
  getHeader() {
    return this.service.getHeader();
  }

  // @Get()
  // @ApiOkResponse({ isArray: true, type: User })
  // findAll(@Query() paginationDto: PaginationDto) {
  //   return this.service.findAll(paginationDto);
  // }

  @Get('user/:userId')
  @ApiOkResponse({ type: User })
  findOne(@Param('userId') userId: string) {
    return this.service.findOne(userId);
  }

  @Patch(':id')
  @ApiOkResponse({ type: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.service.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
