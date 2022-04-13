import { Upload } from './../../upload/entities/upload.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';

@Schema({ timestamps: true })
export class Office {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: () => User })
  admins: User[];

  @Prop({ unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Office })
  parent?: Office;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Upload })
  stamp: Upload;
}

export type OfficeDocument = Office & mongoose.Document;

export const OfficeSchema = SchemaFactory.createForClass(Office);
