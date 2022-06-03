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

  async create(createOfficeDto: CreateOfficeDto) {
    const office = await this.model.create(createOfficeDto);

    // if (office.parent) {
    //   await this.model.updateOne(
    //     { _id: office.parent },
    //     { $push: { children: office.id } },
    //   );
    // }

    return office;
  }

  findAll(onlyHasUnits: boolean) {
    const query = { parent: { $exists: false } };

    if (onlyHasUnits) {
      query['hasUnits'] = onlyHasUnits;
    }

    return this.model.find(query);
  }

  findAllOfficeHasUnits() {
    return this.model.find({ hasUnits: true });
  }

  findAllUnits() {
    return this.model
      .find({ parent: { $exists: true } })
      .sort('parent')
      .populate('parent');
  }

  findOne(id: string) {
    return this.model.findById(id).orFail();
  }

  findChildren(parent: string) {
    return this.model.find({ parent });
  }

  update(id: string, updateOfficeDto: UpdateOfficeDto) {
    return this.model.findByIdAndUpdate(id, updateOfficeDto, { new: true });
  }

  async remove(id: string) {
    const office = await this.model.findByIdAndDelete(id, { new: true });

    // if (office.parent) {
    //   await this.model.updateOne(
    //     { _id: office.parent },
    //     { $pop: { children: office.id } },
    //   );
    // }

    return office;
  }
}
