import { Telescope, TelescopeDocument } from './entities/telescope.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationResponse } from 'src/common/res/pagination.res';

@Injectable()
export class TelescopeService {
  constructor(
    @InjectModel(Telescope.name) private model: Model<TelescopeDocument>,
  ) {}

  create(data: {
    userId?: string;
    path: string;
    method: string;
    statusCode: number;
    duration: number;
    ip: string;
    memory: number;
    headers?: string;
    body?: string;
    response?: string;
    time: Date;
  }) {
    return this.model.create(data);
  }

  findAll(paginationDto: PaginationDto) {
    const queryBuilder = this.model
      .find()
      .select('method path statusCode duration time userId')
      .sort('-_id');

    return new PaginationResponse(queryBuilder, paginationDto).getResponse();
  }

  findOne(id: string) {
    return this.model.findById(id);
  }
}
