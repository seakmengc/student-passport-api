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

  @Get(':id')
  @ApiOkResponse({ type: User })
  async findOne(@Param('id') id: string) {
    const user = await this.service.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.setProfileUrl(user, this.authenticationService);

    return user;
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

  private async setProfileUrl(
    user: User,
    authenticationService: AuthenticationService,
  ): Promise<void> {
    if (!user.profile) {
      user.profileUrl = `https://avatars.dicebear.com/api/avataaars/${user._id}.svg`;
      return;
    }

    const signature = await authenticationService.generateSignatureForUpload(
      user.profile?._id,
    );

    user.profileUrl =
      process.env.APP_URL + `/upload/${user.profile}/file?sig=${signature}`;
  }
}
