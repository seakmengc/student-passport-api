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
import { Match } from 'src/validators/match.validator';
import { Role } from '../entities/user.entity';

export class UpdatePasswordDto {
  @ApiProperty()
  @Length(8, 255)
  @IsString()
  password: string;

  @ApiProperty()
  @Length(8, 255)
  @IsString()
  newPassword: string;

  @ApiProperty()
  @Match(UpdatePasswordDto, (dto) => dto.newPassword)
  @Length(8, 255)
  @IsString()
  newPasswordConfirmation: string;
}
