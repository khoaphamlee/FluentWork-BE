import { Module } from '@nestjs/common';
import { LessonAnswersService } from './lesson-answers.service';
import { LessonAnswersController } from './lesson-answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonQuestion } from 'src/lesson-questions/entities/lesson-question.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Question } from 'src/questions/entities/question.entity';
import { LessonAnswer } from './entities/lesson-answer.entity';
import { Option } from 'src/options/entities/option.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Lesson, LessonQuestion, Question, LessonAnswer, Option])],
    controllers: [LessonAnswersController],
    providers: [LessonAnswersService],
})
export class LessonAnswersModule {}
