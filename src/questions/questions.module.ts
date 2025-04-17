import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Option } from 'src/options/entities/option.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Option, TestQuestion, TestTemplate])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
