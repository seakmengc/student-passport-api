import { Answer, AnswerSchema } from './answer.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Office } from 'src/modules/office/entities/office.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum QuestType {
  INPUT = 'input',
  MCQ = 'mcq',
  MEDIA = 'media',
}

@Schema({ timestamps: true })
export class Quest {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => Office,
    index: 'hashed',
  })
  office: Office;

  @ApiProperty()
  @Prop()
  quest: string;

  @ApiProperty()
  @Prop()
  questType: QuestType;

  @ApiProperty()
  @Prop({ type: [AnswerSchema] })
  possibleAnswers?: Answer[];

  @ApiProperty()
  @Prop({ min: 1 })
  order: number;

  @ApiProperty()
  @Prop()
  autoGrading: boolean;

  @ApiProperty()
  @Prop({ default: true })
  isActive: boolean;
}

export type QuestDocument = Quest & mongoose.Document;

export const QuestSchema = SchemaFactory.createForClass(Quest);
