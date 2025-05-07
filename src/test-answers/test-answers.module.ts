import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestAnswersService } from './test-answers.service';
import { TestAnswersController } from './test-answers.controller';
import { TestAnswer } from './entities/test-answer.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { Option } from 'src/options/entities/option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestAnswer, TestQuestion, Option]),
  ],
  controllers: [TestAnswersController],
  providers: [TestAnswersService],
})
export class TestAnswersModule {}
