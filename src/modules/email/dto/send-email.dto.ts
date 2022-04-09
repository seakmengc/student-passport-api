import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

class Button {
  @ApiProperty()
  name: string;

  @ApiProperty()
  link: string;
}

export class SendEmailDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  to: string | string[];

  @IsObject()
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string', example: 'Replaced value' },
  })
  replacements: Record<string, string>;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  button?: Button;
}
