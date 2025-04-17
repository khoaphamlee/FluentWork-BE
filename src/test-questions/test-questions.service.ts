import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestQuestionDto } from './dto/create-test-question.dto';
import { UpdateTestQuestionDto } from './dto/update-test-question.dto';
import { TestQuestion } from './entities/test-question.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';

@Injectable()
export class TestQuestionsService {
  constructor(
    @InjectRepository(TestQuestion)
    private readonly testQuestionRepository: Repository<TestQuestion>,

    @InjectRepository(TestTemplate)
    private readonly testTemplateRepository: Repository<TestTemplate>,
  ) {}

  async create(createDto: CreateTestQuestionDto) {
    const template = await this.testTemplateRepository.findOne({
      where: { id: createDto.test_template_id },
    });

    if (!template) {
      throw new NotFoundException('Test template not found');
    }

    const newQuestion = this.testQuestionRepository.create({
      question_text: createDto.question_text,
      options: createDto.options,
      correct_answer_index: createDto.correct_answer_index,
      //testTemplate: template,
    });

    return await this.testQuestionRepository.save(newQuestion);
  }

  async findAll() {
    return await this.testQuestionRepository.find();
  }

  async findOne(id: number) {
    const question = await this.testQuestionRepository.findOne({
      where: { id },
      relations: ['testTemplate'],
    });

    if (!question) {
      throw new NotFoundException(`Test question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: number, updateDto: UpdateTestQuestionDto) {
    const question = await this.testQuestionRepository.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException(`Test question with ID ${id} not found`);
    }

    const updated = this.testQuestionRepository.merge(question, updateDto);
    return await this.testQuestionRepository.save(updated);
  }

  async remove(id: number) {
    const question = await this.testQuestionRepository.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException(`Test question with ID ${id} not found`);
    }

    await this.testQuestionRepository.remove(question);
    return { message: 'Test question deleted successfully', id };
  }
}
