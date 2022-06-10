import { AllowUnauth } from './../../decorators/allow-unauth.decorator';
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
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthenticationService } from '../auth/services/authentication.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthId } from 'src/decorators/auth-id.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @ApiCreatedResponse({ type: User })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @AllowUnauth()
  @ApiCreatedResponse({ type: User })
  @Post('/register')
  async publicRegister(@Body() registerDto: RegisterDto) {
    const user = await this.service.publicRegister(registerDto);

    return this.authenticationService.generateTokens(user);
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

  @Get()
  @ApiOkResponse({ isArray: true, type: User })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.service.findAll(paginationDto);
  }

  @Get('/admin')
  @ApiOkResponse({ isArray: true, type: User })
  getAdmins() {
    console.log('getAdmins');

    return this.service.getAdmins();
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  async findOne(@Param('id') id: string) {
    const user = await this.service.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Put('/me/password')
  @ApiOkResponse({ type: User })
  async updateMyPassword(
    @AuthId() id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.service.updatePassword(id, updatePasswordDto);

    return user;
  }

  @Patch('/me')
  @ApiOkResponse({ type: User })
  async updateMe(@AuthId() id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.service.update(id, updateUserDto);

    return user;
  }

  @Patch(':id')
  @ApiOkResponse({ type: User })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.service.update(id, updateUserDto);

    return user;
  }

  @Put(':id/:action')
  async toggleBlock(@Param('id') id: string, @Param('action') action: string) {
    await this.service.toggleBlock(id, action);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
