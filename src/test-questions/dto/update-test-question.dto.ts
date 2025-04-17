import { PartialType } from '@nestjs/mapped-types';
import { CreateTestQuestionDto } from './create-test-question.dto';

export class UpdateTestQuestionDto extends PartialType(CreateTestQuestionDto) {}
