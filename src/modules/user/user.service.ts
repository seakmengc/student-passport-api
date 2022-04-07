import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Property } from 'src/common/entities/property';
import { HeaderSchema } from 'src/common/res';
import { PaginationResponse } from 'src/common/res/pagination.res';
import { FindOneOptions } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const user = User.create(createUserDto);

    return user.save();
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
    const queryBuilder = User.createQueryBuilder();

    return new PaginationResponse(queryBuilder, paginationDto).getResponse();
  }

  findOne(id: number, options?: FindOneOptions) {
    return User.findOneOrFail(id, options);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await User.findOne(id);

    Property.setProperties(user, updateUserDto);

    return user.save();
  }

  remove(id: number) {
    return User.delete(id);
  }
}
