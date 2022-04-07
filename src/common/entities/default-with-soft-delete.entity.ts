import { ApiPropertyOptional } from '@nestjs/swagger';
import { DeleteDateColumn } from 'typeorm';
import { Default } from './default.entity';

export abstract class DefaultWithSoftDelete extends Default {
  @DeleteDateColumn()
  @ApiPropertyOptional()
  deletedAt?: Date;
}
