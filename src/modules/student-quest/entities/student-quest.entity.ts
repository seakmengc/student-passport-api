import { Answer } from './../../quest/entities/answer.entity';
import { Upload } from 'src/modules/upload/entities/upload.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Quest } from 'src/modules/quest/entities/quest.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { StudentOffice } from 'src/modules/student-office/entities/student-office.entity';
import { Office } from 'src/modules/office/entities/office.entity';

export enum StudentQuestStatus {
  PENDING = 1,
  REJECTED = 2,
  APPROVED = 3,
}

@Schema({ timestamps: true })
export class StudentQuest {
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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Quest })
  quest: Quest;

  @ApiPropertyOptional()
  @Prop()
  input?: string;

  @ApiPropertyOptional()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Upload })
  upload?: Upload;

  @ApiPropertyOptional()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Answer })
  answer?: Answer;

  @ApiProperty()
  @Prop({ default: StudentQuestStatus.PENDING, index: true })
  status: StudentQuestStatus;

  @ApiPropertyOptional()
  @Prop()
  reason?: string;

  @ApiPropertyOptional()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
  approvedBy?: User;

  @ApiPropertyOptional()
  @Prop()
  approvedAt?: Date;
}

export type StudentQuestDocument = StudentQuest & mongoose.Document;

export const StudentQuestSchema = SchemaFactory.createForClass(StudentQuest);

StudentQuestSchema.index({ user: 1, quest: 1 }, { unique: true });

StudentQuestSchema.methods.toJSON = function () {
  return {
    ...this.toObject(),
    statusNumber: this.status,
    status:
      this.status === 1
        ? 'pending'
        : this.status === 2
        ? 'rejected'
        : 'approved',
    canSubmit: this.status === StudentQuestStatus.REJECTED,
  };
};
