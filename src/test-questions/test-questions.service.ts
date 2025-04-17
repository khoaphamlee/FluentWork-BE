import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestQuestionDto } from './dto/create-test-question.dto';
import { UpdateTestQuestionDto } from './dto/update-test-question.dto';
import { TestQuestion } from './entities/test-question.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { Question } from 'src/questions/entities/question.entity';

@Injectable()
export class TestQuestionsService {
  constructor(
    @InjectRepository(TestQuestion)
    private readonly testQuestionRepository: Repository<TestQuestion>,

    @InjectRepository(TestTemplate)
    private readonly testTemplateRepository: Repository<TestTemplate>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(createDto: CreateTestQuestionDto) {
    const template = await this.testTemplateRepository.findOneBy({
      id: createDto.test_template_id,
    });
  
    const question = await this.questionRepository.findOneBy({
      id: createDto.question_id,
    });
  
    if (!template || !question) {
      throw new NotFoundException('Template hoặc Question không tồn tại');
    }
  
    const newTestQuestion = this.testQuestionRepository.create({
      testTemplate: template,
      question: question,
    });
  
    return await this.testQuestionRepository.save(newTestQuestion);
  }  

  async findAll() {
    return await this.testQuestionRepository.find({
      relations: ['question', 'question.options'],
    });
  }

  async findOne(id: number) {
    const testQuestion = await this.testQuestionRepository.findOne({
      where: { id },
      relations: ['question'],
    });

    if (!testQuestion) {
      throw new NotFoundException(`Test question with ID ${id} not found`);
    }

    return testQuestion;
  }

  async update(id: number, updateDto: UpdateTestQuestionDto) {
    const testQuestion = await this.testQuestionRepository.findOne({
      where: { id },
      relations: ['question', 'testTemplate'],
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
  
    if (updateDto.test_template_id) {
      const template = await this.testTemplateRepository.findOne({
        where: { id: updateDto.test_template_id },
      });
  
      if (!template) {
        throw new NotFoundException('Test template not found');
      }
  
      testQuestion.testTemplate = template;
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
