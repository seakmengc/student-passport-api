import { SelectFilterSchema } from './filters/select.schema';
import { IdDataType } from './id-data.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HeaderSchema {
  @ApiProperty({
    type: SelectFilterSchema,
    isArray: true,
  })
  filter: SelectFilterSchema[];

  @ApiProperty({
    type: IdDataType,
    isArray: true,
  })
  header: IdDataType[];

  @ApiProperty({
    type: IdDataType,
    isArray: true,
  })
  sort: IdDataType[];

  @ApiPropertyOptional()
  searchHint?: string;
}
