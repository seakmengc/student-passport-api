import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  page = '1';

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  filter: Record<string, string | number> = {};

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  sort?: string;
}
