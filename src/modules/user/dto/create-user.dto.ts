import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsEnum,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { Role } from '../entities/user.entity';

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

  @ApiProperty()
  @IsEnum(Role)
  role: Role;
}
