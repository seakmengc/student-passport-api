import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @Length(1, 255)
  @IsString()
  name: string;

  @ApiProperty()
  @Length(1, 255)
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(8, 255)
  @IsString()
  password: string;
}
