import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestQuestionsService } from './test-questions.service';
import { TestQuestionsController } from './test-questions.controller';
import { TestQuestion } from './entities/test-question.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Test } from 'src/tests/entities/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestQuestion, TestTemplate, Question, Test])],
  controllers: [TestQuestionsController],
  providers: [TestQuestionsService],
})
export class TestQuestionsModule {}
