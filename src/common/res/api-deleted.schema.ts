import { ApiProperty } from '@nestjs/swagger';
export class ApiDeleted {
  @ApiProperty({ default: 1 })
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
