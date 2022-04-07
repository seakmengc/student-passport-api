import { IdDataType } from './../res/id-data.schema';
export enum Types {
  NUMBER = 'number',
  TEXT = 'text',
  SELECT = 'select',
  DATE = 'date',
  BETWEEN_DATE = 'betweenDate',
  BETWEEN_NUMBER = 'betweenNumber',
}

export class FilterableHelper {
  makeSelect(
    field: string,
    options: IdDataType[],
    multiple = true,
    defaultValue = undefined,
  ) {
    return {
      field: field,
      type: 'select',
      options: options,
      multiple: multiple,
      default: defaultValue,
    };
  }
}
