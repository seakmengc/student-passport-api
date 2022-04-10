import { PaginationResponse } from './../../common/res/pagination.res';
import { PaginationDto } from './../../common/dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { Office } from './entities/office.entity';

@Injectable()
export class OfficeService {
  constructor(
    @InjectModel(Office.name) private model: mongoose.Model<Office>,
  ) {}

  create(createOfficeDto: CreateOfficeDto) {
    return this.model.create(createOfficeDto);
  }

  findAll(paginationDto: PaginationDto) {
    const queryBuilder = this.model.find();

    return new PaginationResponse(queryBuilder, paginationDto).getResponse();
  }

  findOne(id: string) {
    return this.model.findById(id).orFail();
  }

  update(id: string, updateOfficeDto: UpdateOfficeDto) {
    return this.model.findByIdAndUpdate(id, updateOfficeDto, { new: true });
  }

  remove(id: string) {
    return this.model.findByIdAndDelete(id, { new: true });
  }
}
