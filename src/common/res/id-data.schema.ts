import { ApiProperty } from '@nestjs/swagger';

export class IdDataType {
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'integer' }],
  })
  id: string | number;

  @ApiProperty()
  data: string;
}

export function formatIdData(values: string[] | number[]): IdDataType[] {
  return values.map((val: number | string): IdDataType => {
    const words = val
      .toString()
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/Id$/, 'ID');

    return {
      id: val,
      data: words,
    };
  });
}
