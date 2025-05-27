import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Test } from 'src/tests/entities/test.entity';
import { Flashcard } from 'src/flashcards/entities/flashcard.entity';
import { LearnerProfile } from 'src/learner-profiles/entities/learner-profile.entity';
import { LessonProgress } from 'src/lesson-progresses/entities/lesson-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Question,
      Lesson,
      Flashcard,
      LearnerProfile,
      LessonProgress,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
