import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

//transform empty string to null
//transform number string to number
@Injectable()
export class TransformInputPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || metadata.type !== 'body') {
      return value;
    }

    //in case a single param access
    if (metadata.data) {
      return value === '' ? null : value;
    }

    this.processTransform(value);

    console.log(value);

    return value;
  }

  processTransform(value) {
    for (const key in value) {
      if (value[key] === null) {
        continue;
      }

      if (typeof value[key] === 'object') {
        this.processTransform(value[key]);
        continue;
      }

      if (value[key] === '') {
        value[key] = null;
      }
    }

    return;
  }
}
