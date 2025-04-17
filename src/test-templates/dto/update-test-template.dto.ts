import { PartialType } from '@nestjs/mapped-types';
import { CreateTestTemplateDto } from './create-test-template.dto';

export class UpdateTestTemplateDto extends PartialType(CreateTestTemplateDto) {}
