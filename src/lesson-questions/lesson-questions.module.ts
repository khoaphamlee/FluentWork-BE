import { Module } from '@nestjs/common';
import { LessonQuestionsService } from './lesson-questions.service';
import { LessonQuestionsController } from './lesson-questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Question } from 'src/questions/entities/question.entity';
import { LessonQuestion } from './entities/lesson-question.entity';
import { LessonAnswer } from 'src/lesson-answers/entities/lesson-answer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Lesson, LessonQuestion, Question, LessonAnswer])],
    controllers: [LessonQuestionsController],
    providers: [LessonQuestionsService],
})
export class LessonQuestionsModule {}
