import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @MinLength(1)
  @IsEmail()
  email: string;
}
