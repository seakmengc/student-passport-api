import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { Match } from 'src/validators/match.validator';

export class ResetPasswordDto {
  @ApiProperty()
  @MinLength(1)
  @IsString()
  token: string;

  @ApiProperty()
  @MinLength(8)
  @IsString()
  newPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Match(ResetPasswordDto, (dto) => dto.newPassword, {
    message: 'Password and Password Confirmation does not match.',
  })
  newPasswordConfirmation: string;
}
