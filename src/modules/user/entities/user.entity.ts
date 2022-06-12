import { hash } from 'bcryptjs';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Upload } from 'src/modules/upload/entities/upload.entity';
import { Student } from './student.entity';

export enum Role {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  STUDENT = 'Student',
}

@Schema({ timestamps: true })
export class User {
  id: string;

  @ApiProperty()
  @Prop()
  firstName: string;

  @ApiProperty()
  @Prop()
  lastName: string;

  @ApiProperty()
  @Prop({ unique: true })
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop()
  role: Role;

  @ApiProperty()
  @Prop({ default: true })
  isActive: boolean;

  @ApiPropertyOptional()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Upload })
  profile?: Upload;

  @ApiPropertyOptional()
  @Prop({ virtual: true })
  profileUrl?: string;

  @ApiProperty()
  @Prop({ type: Student })
  student?: Student;
}

export type UserDocument = User & mongoose.Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ role: 1, 'student.officesCompleted': -1 });

UserSchema.methods.toJSON = function () {
  return {
    ...this.toObject(),
    password: undefined,
    name: this.firstName + ' ' + this.lastName,
    isAdmin: this.role?.endsWith('Admin'),
    profileUrl: this.profile
      ? process.env.APP_URL + `/upload/${this.profile}/file`
      : `https://avatars.dicebear.com/api/avataaars/${this.id}.svg`,
  };
};

UserSchema.pre('save', async function (next) {
  const user = this as any;

  if (user.isModified('password')) {
    user.password = await hash(user.password, 10);
  }

  if (user.isModified('email') && user.email) {
    user.email = user.email.toLowerCase();
  }

  try {
  } catch (e) {
    return next(e);
  }

  return next();
});
