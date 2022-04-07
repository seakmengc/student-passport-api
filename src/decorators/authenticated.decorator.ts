import { UserSchema } from './../modules/user/entities/user.entity';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import mongoose from 'mongoose';

export const Authenticated = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const UserModel = mongoose.model(User.name, UserSchema);

    request.user = await UserModel.findById(request.payload.sub);
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return request.user;
  },
);
