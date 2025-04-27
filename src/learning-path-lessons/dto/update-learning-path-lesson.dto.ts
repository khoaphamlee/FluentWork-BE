import { PartialType } from '@nestjs/swagger';
import { CreateLearningPathLessonDto } from './create-learning-path-lesson.dto';

export class UpdateLearningPathLessonDto extends PartialType(CreateLearningPathLessonDto) {}
