import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';

@Schema({ timestamps: true })
export class ResetPassword {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ unique: true })
  token: string;

  @Prop()
  expiresAt: Date;
}

export type ResetPasswordDocument = ResetPassword & Document;

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);
