import { Upload } from './../../upload/entities/upload.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';

@Schema({ timestamps: true })
export class Office {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: () => User })
  admins: User[];

  @ApiProperty()
  @Prop({ unique: true })
  name: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Office })
  parent?: Office;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Upload })
  stamp: Upload;
}

export type OfficeDocument = Office & mongoose.Document;

export const OfficeSchema = SchemaFactory.createForClass(Office);
