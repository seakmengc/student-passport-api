import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
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

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hasUnits?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  parent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  stamp?: string;
}
