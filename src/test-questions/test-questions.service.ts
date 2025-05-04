import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestQuestionDto } from './dto/create-test-question.dto';
import { UpdateTestQuestionDto } from './dto/update-test-question.dto';
import { TestQuestion } from './entities/test-question.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Test } from 'src/tests/entities/test.entity';

@Injectable()
export class TestQuestionsService {
  constructor(
    @InjectRepository(TestQuestion)
    private readonly testQuestionRepository: Repository<TestQuestion>,

    @InjectRepository(TestTemplate)
    private readonly testTemplateRepository: Repository<TestTemplate>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
  ) {}

  async create(createDto: CreateTestQuestionDto) {
    const test = await this.testRepository.findOneBy({ id: createDto.test_id });
    const question = await this.questionRepository.findOneBy({ id: createDto.question_id });

    if (!test || !question) {
      throw new NotFoundException('Test hoặc Question không tồn tại');
    }

    const newTestQuestion = this.testQuestionRepository.create({
      test,
      question,
    });

    return await this.testQuestionRepository.save(newTestQuestion);
  }

  async findAll() {
    return await this.testQuestionRepository.find({
      relations: ['question', 'question.options', 'test'],
    });
  }

  async findOne(id: number) {
    const testQuestion = await this.testQuestionRepository.findOne({
      where: { id },
      relations: ['question', 'test'],
    });

    if (!testQuestion) {
      throw new NotFoundException(`Test question with ID ${id} not found`);
    }

    return testQuestion;
  }

  async update(id: number, updateDto: UpdateTestQuestionDto) {
    const testQuestion = await this.testQuestionRepository.findOne({
      where: { id },
      relations: ['question', 'test'],
    });
  
    if (!testQuestion) {
      throw new NotFoundException(`Test question with ID ${id} not found`);
    }
  
    if (updateDto.question_id) {
      const question = await this.questionRepository.findOne({
        where: { id: updateDto.question_id },
      });
  
      if (!question) {
        throw new NotFoundException('Question not found');
      }
  
      testQuestion.question = question;
    }
  
    if (updateDto.test_id) {
      const test = await this.testRepository.findOne({
        where: { id: updateDto.test_id },
      });
  
      if (!test) {
        throw new NotFoundException('Test not found');
      }
  
      testQuestion.test = test;
    }
  
    return await this.testQuestionRepository.save(testQuestion);
  }
  

  async remove(id: number) {
    const testQuestion = await this.testQuestionRepository.findOne({ where: { id } });

    if (!testQuestion) {
      throw new NotFoundException(`Test question with ID ${id} not found`);
    }

    await this.testQuestionRepository.remove(testQuestion);
    return { message: 'Test question deleted successfully', id };
  }
}
