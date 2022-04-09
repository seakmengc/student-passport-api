import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Student {
  @ApiProperty()
  @Prop()
  studentId: string;

  @ApiProperty()
  @Prop({ default: true })
  isActive: boolean;

  constructor(studentId: string) {
    this.studentId = studentId;
  }
}

export type StudentDocument = Student & Document;

export const StudentSchema = SchemaFactory.createForClass(Student);
