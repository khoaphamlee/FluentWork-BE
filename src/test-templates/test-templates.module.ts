import { Module } from '@nestjs/common';
import { TestTemplatesService } from './test-templates.service';
import { TestTemplatesController } from './test-templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestTemplate } from './entities/test-template.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { Question } from 'src/questions/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestTemplate, TestQuestion, Question])],
  controllers: [TestTemplatesController],
  providers: [TestTemplatesService],
  exports: [TestTemplatesService],
})
export class TestTemplatesModule {}
