import { Module } from '@nestjs/common';
import { LearningPathsService } from './learning-paths.service';
import { LearningPathsController } from './learning-paths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningPath } from './entities/learning-path.entity';
import { LearningPathLesson } from 'src/learning-path-lessons/entities/learning-path-lesson.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LearningPath, LearningPathLesson, Lesson])],
    controllers: [LearningPathsController],
    providers: [LearningPathsService],
})
export class LearningPathsModule {}
