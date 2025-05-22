import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { LessonQuestion } from 'src/lesson-questions/entities/lesson-question.entity';
import { Question } from 'src/questions/entities/question.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Lesson, LessonQuestion, Question])],
    controllers: [LessonsController],
    providers: [LessonsService],
})
export class LessonsModule {}
