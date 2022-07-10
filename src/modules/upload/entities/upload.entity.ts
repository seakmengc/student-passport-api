import { User } from 'src/modules/user/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Upload {
  _id: string;
  id: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, index: 'hashed' })
  user: string;

  @ApiProperty()
  @Prop()
  path: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  size: number;

  @ApiProperty()
  @Prop()
  mimeType: string;

  @ApiProperty()
  @Prop({ default: false })
  completed: boolean;

  static complete(
    uploadId: string,
    uploadModel: mongoose.Model<UploadDocument>,
  ) {
    return uploadModel.findOneAndUpdate(
      { _id: uploadId, completed: false },
      { completed: true },
    );
  }
}

export type UploadDocument = Upload & mongoose.Document;

export const UploadSchema = SchemaFactory.createForClass(Upload);
