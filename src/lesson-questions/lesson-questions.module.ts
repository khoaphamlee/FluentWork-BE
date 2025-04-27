import { Module } from '@nestjs/common';
import { LessonQuestionsService } from './lesson-questions.service';
import { LessonQuestionsController } from './lesson-questions.controller';

@Module({
  controllers: [LessonQuestionsController],
  providers: [LessonQuestionsService],
})
export class LessonQuestionsModule {}
