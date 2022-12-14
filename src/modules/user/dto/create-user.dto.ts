import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { Role } from '../entities/user.entity';

export class CreateUserDto {
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

  @ApiProperty()
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profile?: string;
}
