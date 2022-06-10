import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Office } from 'src/modules/office/entities/office.entity';

@Schema()
export class Student {
  @ApiProperty()
  @Prop()
  studentId?: string;

  @ApiProperty()
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: () => Office })
  officesCompleted: Office[];
}

export type StudentDocument = Student & mongoose.Document;

export const StudentSchema = SchemaFactory.createForClass(Student);
