import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateStudentQuestDto {
  @ApiProperty()
  @IsMongoId()
  quest: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  input?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  upload?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  answer?: string;
}
