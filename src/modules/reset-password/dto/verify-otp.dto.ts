import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength, IsEmail } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty()
  @MinLength(1)
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumber()
  otp: number;
}
