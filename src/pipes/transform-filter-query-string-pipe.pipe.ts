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

    value['filter'] = {};
    for (const key in value) {
      if (!key.startsWith(this.prefix) || !key.endsWith(this.suffix)) {
        continue;
      }

      value['filter'][
        key.substring(this.prefix.length, key.length - this.suffix.length)
      ] = value[key];
    }

    return value;
  }
}
