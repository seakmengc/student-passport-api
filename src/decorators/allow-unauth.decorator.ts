import { SetMetadata } from '@nestjs/common';

export const AllowUnauth = (allowUnauth = true) =>
  SetMetadata('allowUnauth', allowUnauth);
