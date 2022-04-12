import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema()
export class Answer {
  @ApiProperty()
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop()
  answer: string;

  @ApiProperty()
  @Prop()
  correct: boolean;

  constructor(answer: string, correct: boolean) {
    // this._id = new mongoose.Types.ObjectId();
    this.answer = answer;
    this.correct = correct;
  }
}

export type AnswerDocument = Answer & Document;

export const AnswerSchema = SchemaFactory.createForClass(Answer);
