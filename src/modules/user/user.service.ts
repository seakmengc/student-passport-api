import { Upload, UploadDocument } from './../upload/entities/upload.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HeaderSchema } from 'src/common/res';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { Student } from './entities/student.entity';

import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationResponse } from 'src/common/res/pagination.res';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.profile) {
      await Upload.complete(createUserDto.profile, this.uploadModel);
    }

    const user = await this.userModel.create(createUserDto);

    return user;
  }

  async publicRegister(registerDto: RegisterDto) {
    if (
      registerDto.email.split('@', 2)[1] !==
      this.configService.get('EMAIL_DOMAIN')
    ) {
      throw new BadRequestException(
        'Only Paragon.U email is allowed to register.',
      );
    }

    const user = await this.userModel.create({
      ...registerDto,
      role: Role.STUDENT,
    });

    return user;
  }

  getForCreate() {
    return {};
  }

  getHeader(): HeaderSchema {
    return {
      filter: [],
      header: [
        { id: 'displayName', data: 'Name' },
        { id: 'description', data: 'Description' },
      ],
      sort: [],
    };
  }

  findAll(paginationDto: PaginationDto) {
    const queryBuilder = this.userModel.find(null, null, {
      populate: 'profile',
    });

    return new PaginationResponse(queryBuilder, paginationDto).getResponse();
  }

  findOne(id: string, projection = null) {
    return this.userModel.findById(id, projection).orFail();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
