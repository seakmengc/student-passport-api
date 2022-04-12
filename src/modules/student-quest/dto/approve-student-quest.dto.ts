import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, ValidateIf } from 'class-validator';

export class ApproveStudentQuestDto {
  @ApiProperty()
  @IsBoolean()
  isApproved: boolean;

  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((o) => !o.isApproved)
  reason?: string;
}
