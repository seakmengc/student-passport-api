import { PaginationDto } from './../dto/pagination.dto';
import mongoose from 'mongoose';

export class PaginationResponse<T> {
  private perPage = 15;

  constructor(
    private query: mongoose.QueryWithHelpers<T, any, any, any>,
    private readonly paginationDto: PaginationDto,
  ) {}

  private parseFilter() {
    if (!this.paginationDto.filter) {
      return;
    }

    const filter = this.paginationDto.filter as any;
    for (const key in filter) {
      filter[key] = {
        $regex: this.paginationDto.filter[key] + '.*',
        $options: 'i',
      };
    }

    this.query.where(filter);
  }

  private parseSort() {
    if (!this.paginationDto.sort) {
      return;
    }

    this.paginationDto.sort.split(',').forEach((eachField) => {
      let order: 'ASC' | 'DESC';
      let fieldInDB: string;
      if (eachField.startsWith('-')) {
        order = 'DESC';
        fieldInDB = eachField.substring(1);
      } else {
        order = 'ASC';
        fieldInDB = eachField;
      }

      this.query = this.query.orderBy(fieldInDB, order);
    });
  }

  async getResponse() {
    this.parseFilter();

    this.parseSort();

    const res = await this.query
      .clone()
      .limit(this.perPage)
      .skip((+this.paginationDto.page - 1) * this.perPage)
      .exec();

    const totalItems = await this.query.clone().count();

    return {
      data: res,
      pagination: {
        count: res.length,
        currentPage: +this.paginationDto.page,
        perPage: this.perPage,
        total: totalItems,
        totalPages: Math.ceil(totalItems / this.perPage),
      },
    };
  }
}
