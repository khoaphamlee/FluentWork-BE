import { PartialType } from '@nestjs/swagger';
import { CreateLessonQuestionDto } from './create-lesson-question.dto';

export class UpdateLessonQuestionDto extends PartialType(CreateLessonQuestionDto) {}
