import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateOfficeDto {
  @ApiProperty()
  @IsOptional()
  @IsMongoId({ each: true })
  admins: string[];

  @ApiProperty()
  @Length(1, 255)
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  parent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  stamp?: string;
}
