import { PartialType } from '@nestjs/swagger';
import { CreateLessonQaDto } from './create-lesson-qa.dto';

export class UpdateLessonQaDto extends PartialType(CreateLessonQaDto) {}
