import { Quest } from './../../quest/entities/quest.entity';
import { Office } from './../../office/entities/office.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema()
export class StudentOffice {
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  id: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
  user: User;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Office })
  office: Office;

  @ApiProperty()
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: () => Quest })
  quests: Quest[];

  @ApiProperty()
  @Prop({ default: 0 })
  numOfQuestsCompleted: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Quest })
  lastCompleted?: Quest;

  @ApiProperty()
  @Prop({ default: false })
  completed: boolean;
}

export type StudentOfficeDocument = StudentOffice & mongoose.Document;

export const StudentOfficeSchema = SchemaFactory.createForClass(StudentOffice);

StudentOfficeSchema.index({ user: 1, office: 1 }, { unique: true });
