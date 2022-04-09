import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateEmailDto {
  @Length(1, 100)
  @IsString()
  @ApiProperty()
  name: string;

  @MaxLength(255)
  @IsString()
  @ApiProperty()
  subject: string;

  @MaxLength(30000)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  header?: string;

  @MaxLength(30000)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  body?: string;

  @MaxLength(30000)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  footer?: string;
}
