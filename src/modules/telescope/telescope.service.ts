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
    cpu: number;
    memory: number;
    headers?: Record<string, any>;
    body?: Record<string, any>;
    response?: Record<string, any>;
    time: Date;
  }) {
    return this.model.create(data);
  }

  findAll(paginationDto: PaginationDto) {
    const queryBuilder = this.model
      .find()
      .select('method path statusCode duration time');

    return new PaginationResponse(queryBuilder, paginationDto).getResponse();
  }

  findOne(id: string) {
    return this.model.findById(id);
  }
}
