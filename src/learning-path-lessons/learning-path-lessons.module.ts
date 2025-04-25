import { Module } from '@nestjs/common';
import { LearningPathLessonsService } from './learning-path-lessons.service';
import { LearningPathLessonsController } from './learning-path-lessons.controller';

@Module({
  controllers: [LearningPathLessonsController],
  providers: [LearningPathLessonsService],
})
export class LearningPathLessonsModule {}
