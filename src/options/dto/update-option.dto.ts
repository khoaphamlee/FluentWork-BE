import { PartialType } from '@nestjs/mapped-types';
import { CreateOptionDto } from './create-option.dto';
import { IsNumber } from 'class-validator';

export class UpdateOptionDto extends PartialType(CreateOptionDto) {
  @IsNumber()
  id: number;
}
