import {
  RefreshToken,
  RefreshTokenDocument,
} from './../auth/entities/refresh-token.entity';
import { hash } from 'bcryptjs';
import { UpdatePasswordDto } from './dto/update-password.dto';
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
import { AuthenticationService } from '../auth/services/authentication.service';
import { Office, OfficeDocument } from '../office/entities/office.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private configService: ConfigService,
    private emailService: EmailService,
    private readonly authenticationService: AuthenticationService,
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
      student: new Student(),
    });

    this.emailService.sendMail({
      name: 'welcome',
      to: user.email,
      replacements: {
        name: user.firstName,
      },
      button: {
        name: 'Explore now!',
        link: this.configService.get('FRONTEND_URL'),
      },
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

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userModel
      .findById(id, {
        password: 1,
      })
      .orFail();

    if (
      !(await this.authenticationService.comparePassword(
        updatePasswordDto.password,
        user.password,
      ))
    ) {
      throw new BadRequestException('Password does not match.');
    }

    if (updatePasswordDto.password === updatePasswordDto.newPassword) {
      throw new BadRequestException(
        'Current and New Password should be different.',
      );
    }

    await user.updateOne({
      password: await hash(updatePasswordDto.newPassword, 10),
    });

    return user;
  }

  getAdmins() {
    return this.userModel.find({ role: { $ne: 'Student' } }).exec();
  }

  async getMyOfficeIds(userId: string) {
    return (
      await this.officeModel.find({ admins: userId }, { _id: 1 }).lean().exec()
    ).map((office) => office._id);
  }

  findOne(id: string, projection = null) {
    return this.userModel.findById(id, projection).orFail();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async toggleBlock(id: string, action: string) {
    const user = await this.userModel.findByIdAndUpdate(id, {
      isActive: action !== 'block',
    });

    await this.refreshTokenModel.updateMany(
      {
        user: user.id,
        revokedAt: { $exists: false },
      },
      { revokedAt: new Date() },
    );

    return user;
  }

  remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
