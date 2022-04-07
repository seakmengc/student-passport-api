// import { PaginationDto } from './../dto/pagination.dto';
// import { paginate, PaginationTypeEnum } from 'nestjs-typeorm-paginate';

// export class PaginationResponse<T> {
//   constructor(
//     private query: SelectQueryBuilder<T>,
//     private readonly paginationDto: PaginationDto,
//   ) {}

//   private parseFilter() {
//     if (!this.paginationDto.filter) {
//       return;
//     }

//     this.query = this.query.where(this.paginationDto.filter);
//   }

//   private parseSort() {
//     if (!this.paginationDto.sort) {
//       return;
//     }

//     this.paginationDto.sort.split(',').forEach((eachField) => {
//       let order: 'ASC' | 'DESC';
//       let fieldInDB: string;
//       if (eachField.startsWith('-')) {
//         order = 'DESC';
//         fieldInDB = eachField.substring(1);
//       } else {
//         order = 'ASC';
//         fieldInDB = eachField;
//       }

//       this.query = this.query.orderBy(fieldInDB, order);
//     });
//   }

//   async getResponse() {
//     this.parseFilter();

//     this.parseSort();

//     const res = await paginate<T>(this.query, {
//       page: this.paginationDto.page,
//       limit: 10,
//       paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
//     });

//     return {
//       data: res.items,
//       pagination: {
//         count: res.meta.itemCount,
//         currentPage: res.meta.currentPage,
//         perPage: res.meta.itemsPerPage,
//         total: res.meta.totalItems,
//         totalPages: res.meta.totalPages,
//       },
//     };
//   }
// }
