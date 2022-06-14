import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformFilterQueryStringPipe implements PipeTransform {
  private prefix = 'filter[';
  private suffix = ']';

  transform(value: any, metadata: ArgumentMetadata) {
    //in case of not a query param or just a single query param access
    if (metadata.type !== 'query' || metadata.data) {
      return value;
    }

    if (!(value['filter'] ?? null)) {
      value['filter'] = {};
      return value;
    }

    // console.log({ value });

    const tmp = {};
    for (const each of value['filter'].split('&')) {
      const [key, val] = each.split('=', 2);

      console.log(key, val);

      tmp[key] = val;
    }

    value['filter'] = tmp;

    // console.log({ value });

    return value;
  }
}
