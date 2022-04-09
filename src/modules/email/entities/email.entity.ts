import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  body?: string;

  @Prop()
  @ApiPropertyOptional()
  footer?: string;
}

export type EmailDocument = Email & Document;

export const EmailSchema = SchemaFactory.createForClass(Email);
