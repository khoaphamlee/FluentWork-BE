import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(TestQuestion)
    private readonly testQuestionRepository: Repository<TestQuestion>,

    @InjectRepository(TestTemplate)
    private readonly testTemplateRepository: Repository<TestTemplate>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const newQuestion = this.questionRepository.create(createQuestionDto);
    const savedQuestion = await this.questionRepository.save(newQuestion);

    const testTemplate = await this.testTemplateRepository.findOne({
      where: { id: 1 }, 
    });

    if (!testTemplate) {
      throw new Error('Test template not found');
    }

    const newTestQuestion = this.testQuestionRepository.create({
      testTemplate: testTemplate, 
      question: savedQuestion,
    });

    await this.testQuestionRepository.save(newTestQuestion);

    return savedQuestion;
  }

  async findAll() {
    return await this.questionRepository.find({
      relations: ['options'],
    });
  }

  async findOne(id: number) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepository.preload({
      id,
      ...updateQuestionDto,
    });
    if (!question) throw new NotFoundException('Question not found');
    return await this.questionRepository.save(question);
  }

  async remove(id: number) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    await this.questionRepository.remove(question);
    return { message: 'Question deleted successfully' };
  }
}
