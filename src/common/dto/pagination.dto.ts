import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  page = 1;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  filter: Record<string, string | number> = {};

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  sort?: string;
}
