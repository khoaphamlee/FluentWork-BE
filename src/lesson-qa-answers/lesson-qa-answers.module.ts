import { Module } from '@nestjs/common';
import { LessonQaAnswersService } from './lesson-qa-answers.service';
import { LessonQaAnswersController } from './lesson-qa-answers.controller';

@Module({
  controllers: [LessonQaAnswersController],
  providers: [LessonQaAnswersService],
})
export class LessonQaAnswersModule {}
