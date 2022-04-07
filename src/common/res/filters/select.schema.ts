import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IdDataType } from '../id-data.schema';

export class SelectFilterSchema {
  @ApiProperty()
  field: string;

  @ApiProperty()
  type: string;

  @ApiProperty({
    type: IdDataType,
    isArray: true,
  })
  options: IdDataType[];

  @ApiProperty()
  multiple: boolean;

  @ApiPropertyOptional({
    oneOf: [{ type: 'string' }, { type: 'integer' }],
  })
  default?: string | number;
}
