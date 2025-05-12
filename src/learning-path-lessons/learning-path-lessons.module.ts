import { Module } from '@nestjs/common';
import { LearningPathLessonsService } from './learning-path-lessons.service';
import { LearningPathLessonsController } from './learning-path-lessons.controller';
import { LearningPathLesson } from './entities/learning-path-lesson.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([LearningPathLesson])],
    controllers: [LearningPathLessonsController],
    providers: [LearningPathLessonsService],
})
export class LearningPathLessonsModule {}
