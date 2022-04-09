import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty()
  @Length(1, 255)
  @IsString()
  studentId: string;
}
