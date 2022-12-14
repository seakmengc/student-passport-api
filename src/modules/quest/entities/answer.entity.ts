import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema()
export class Answer {
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  id: string;

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

export type AnswerDocument = Answer & mongoose.Document;

export const AnswerSchema = SchemaFactory.createForClass(Answer);

AnswerSchema.methods.toJSON = function () {
  return {
    ...this.toObject(),
    correct: undefined,
  };
};
