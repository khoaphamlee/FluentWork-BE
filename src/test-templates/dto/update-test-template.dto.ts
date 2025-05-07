import { PartialType } from '@nestjs/mapped-types';
import { CreateTestTemplateDto } from './create-test-template.dto';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, ArrayNotEmpty } from 'class-validator';

export class UpdateTestTemplateDto extends PartialType(CreateTestTemplateDto) {
}