import { hash } from 'bcryptjs';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Upload } from 'src/modules/upload/entities/upload.entity';
import { Student } from './student.entity';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from 'src/modules/auth/services/authentication.service';

export enum Role {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  STUDENT = 'Student',
}

export interface IUser {
  setProfileUrl(authenticationService: AuthenticationService): Promise<void>;
}

@Schema({ timestamps: true })
export class User {
  _id: string;

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

  @Prop()
  role: Role;

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

export type UserDocument = User & mongoose.Document & IUser;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.setProfileUrl = async function (
  authenticationService: AuthenticationService,
): Promise<void> {
  if (!this.profile) {
    this.profileUrl = `https://avatars.dicebear.com/api/avataaars/${this._id}.svg`;
    return;
  }

  const signature = await authenticationService.generateSignatureForUpload(
    this.profile?._id,
  );

  this.profileUrl =
    process.env.APP_URL + `/upload/${this.profile}/file?sig=${signature}`;
};

UserSchema.methods.toJSON = function () {
  return {
    ...this.toObject(),
    password: undefined,
    isAdmin: this.role?.endsWith('Admin'),
  };
};

UserSchema.pre('save', async function (next) {
  const user = this as any;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    user.password = await hash(user.password, 10);

    return next();
  } catch (e) {
    return next(e);
  }
});
