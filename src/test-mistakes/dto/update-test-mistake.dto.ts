import { PartialType } from '@nestjs/swagger';
import { CreateTestMistakeDto } from './create-test-mistake.dto';

export class UpdateTestMistakeDto extends PartialType(CreateTestMistakeDto) {}
