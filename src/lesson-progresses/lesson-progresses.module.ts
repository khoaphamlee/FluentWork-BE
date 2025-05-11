import { Module } from '@nestjs/common';
import { LessonProgressesService } from './lesson-progresses.service';
import { LessonProgressesController } from './lesson-progresses.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonProgress } from './entities/lesson-progress.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonProgress, User, Lesson])],
  controllers: [LessonProgressesController],
  providers: [LessonProgressesService],
  exports: [LessonProgressesService],
})
export class LessonProgressesModule {}
