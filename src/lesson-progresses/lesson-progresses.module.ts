import { Module } from '@nestjs/common';
import { LessonProgressesService } from './lesson-progresses.service';
import { LessonProgressesController } from './lesson-progresses.controller';

@Module({
  controllers: [LessonProgressesController],
  providers: [LessonProgressesService],
})
export class LessonProgressesModule {}
