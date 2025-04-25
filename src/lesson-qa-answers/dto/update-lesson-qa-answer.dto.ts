import { PartialType } from '@nestjs/swagger';
import { CreateLessonQaAnswerDto } from './create-lesson-qa-answer.dto';

export class UpdateLessonQaAnswerDto extends PartialType(CreateLessonQaAnswerDto) {}
