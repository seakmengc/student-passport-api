import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

export class RegisterDto {
  @ApiProperty()
  @Length(1, 255)
  @IsString()
  firstName: string;

  @ApiProperty()
  @Length(1, 255)
  @IsString()
  lastName: string;

  @ApiProperty()
  @Length(1, 255)
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(8, 255)
  @IsString()
  password: string;

  // @ApiProperty()
  // @ValidateNested()
  // @IsObject()
  // @Type(() => CreateStudentDto)
  // student: CreateStudentDto;
}
