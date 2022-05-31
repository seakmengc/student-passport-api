import { CreateAnswerDto } from './create-answer.dto';
import { QuestType } from '../entities/quest.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestDto {
  @ApiProperty()
  @IsMongoId()
  office: string;

  @ApiProperty()
  @IsString()
  quest: string;

  @ApiProperty()
  @IsEnum(QuestType)
  questType: QuestType;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => CreateAnswerDto)
  @ValidateIf((dto: CreateQuestDto) => dto.questType === QuestType.MCQ)
  possibleAnswers?: CreateAnswerDto[];

  @ApiProperty()
  @Min(1)
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty()
  @IsBoolean()
  autoGrading: boolean;
}
