import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum Role {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  STUDENT = 'Student',
}

@Schema({ timestamps: true })
export class User {
  _id: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ unique: true })
  email: string;

  @ApiPropertyOptional()
  @Prop()
  recoveryEmail?: string;

  @ApiProperty()
  @Prop()
  password: string;

  @Prop()
  role: Role;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
