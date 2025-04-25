import { PartialType } from '@nestjs/swagger';
import { CreateLessonAnswerDto } from './create-lesson-answer.dto';

export class UpdateLessonAnswerDto extends PartialType(CreateLessonAnswerDto) {}
