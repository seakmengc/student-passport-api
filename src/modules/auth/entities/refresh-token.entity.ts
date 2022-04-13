import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => User,
    index: 'hashed',
  })
  user: User;

  // @ViewColumn()
  // userId: number;

  @Prop()
  accessTokenHash: string;

  @Prop({ unique: true })
  tokenHash: string;

  @Prop({ nullable: true })
  replacedByTokenHash?: string;

  @Prop({ type: Date, nullable: true })
  revokedAt?: Date;
}

export type RefreshTokenDocument = RefreshToken & mongoose.Document;

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
