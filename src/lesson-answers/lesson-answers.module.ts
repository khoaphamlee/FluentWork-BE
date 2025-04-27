import { Module } from '@nestjs/common';
import { LessonAnswersService } from './lesson-answers.service';
import { LessonAnswersController } from './lesson-answers.controller';

@Module({
  controllers: [LessonAnswersController],
  providers: [LessonAnswersService],
})
export class LessonAnswersModule {}
