import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema()
export class Email {
  @Prop({ length: 100, unique: true })
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  subject: string;

  @Prop()
  @ApiPropertyOptional()
  header?: string;

  @Prop()
  @ApiPropertyOptional()
  subheader?: string;

  @Prop()
  @ApiPropertyOptional()
  img?: string;

  @Prop()
  @ApiPropertyOptional()
  body?: string;

  @Prop()
  @ApiPropertyOptional()
  footer?: string;
}

export type EmailDocument = Email & mongoose.Document;

export const EmailSchema = SchemaFactory.createForClass(Email);
