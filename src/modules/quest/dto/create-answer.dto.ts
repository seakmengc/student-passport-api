import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class CreateAnswerDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @ApiProperty()
  @IsString()
  answer: string;

  @ApiProperty()
  @IsBoolean()
  correct: boolean;
}
