import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class EmptyBodyValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      const isEmpty = !value || Object.keys(value).length === 0;
      if (isEmpty) {
        throw new BadRequestException('Body không được để trống');
      }
    }
    return value;
  }
}
