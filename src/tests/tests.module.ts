import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { Test } from './entities/test.entity';
import { User } from '../users/entities/user.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { TestTemplatesModule } from 'src/test-templates/test-templates.module';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { Question } from 'src/questions/entities/question.entity';
import { LearnerProfile } from 'src/learner-profiles/entities/learner-profile.entity';
import { TestAnswer } from 'src/test-answers/entities/test-answer.entity';
import { OptionsModule } from 'src/options/options.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test, User, TestTemplate, TestQuestion, Question, TestAnswer, LearnerProfile]),
    TestTemplatesModule, OptionsModule
  ],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
