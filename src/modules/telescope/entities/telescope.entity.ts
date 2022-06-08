import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Telescope {
  id: string;

  @Prop()
  userId?: string;

  @Prop()
  path: string;

  @Prop()
  method: string;

  @Prop()
  statusCode: number;

  @Prop()
  duration: number;

  @Prop()
  ip: string;

  @Prop()
  memory: number;

  @Prop()
  cpu: number;

  @Prop({ type: mongoose.Schema.Types.Map })
  headers?: Record<string, any>;

  @Prop({ type: mongoose.Schema.Types.Map })
  response?: Record<string, any>;

  @Prop({ type: mongoose.Schema.Types.Map })
  body?: Record<string, any>;

  @Prop()
  time: Date;
}

export type TelescopeDocument = Telescope & mongoose.Document;

export const TelescopeSchema = SchemaFactory.createForClass(Telescope);
