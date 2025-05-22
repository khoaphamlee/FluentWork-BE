import { Module } from '@nestjs/common';

import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonProgress } from './entities/lesson-progress.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';
import { LessonProgressController } from './lesson-progresses.controller';
import { LessonProgressService } from './lesson-progresses.service';

@Module({
  imports: [TypeOrmModule.forFeature([LessonProgress, User, Lesson])],
  controllers: [LessonProgressController],
  providers: [LessonProgressService],
  exports: [LessonProgressService],
})
export class LessonProgressesModule {}
