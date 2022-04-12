import { Answer, AnswerSchema } from './answer.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Office } from 'src/modules/office/entities/office.entity';

export enum QuestType {
  INPUT = 'input',
  MCQ = 'mcq',
  MEDIA = 'media',
}

@Schema({ timestamps: true })
export class Quest {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Office })
  office: Office;

  @Prop()
  quest: string;

  @Prop()
  questType: QuestType;

  @Prop({ type: [AnswerSchema] })
  possibleAnswers?: Answer[];

  @Prop({ min: 1 })
  order: number;

  @Prop()
  autoGrading: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export type QuestDocument = Quest & Document;

export const QuestSchema = SchemaFactory.createForClass(Quest);
