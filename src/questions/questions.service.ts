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

    // const testTemplate = await this.testTemplateRepository.findOne({
    //   where: { id: 1 },
    // });

    // if (!testTemplate) {
    //   throw new NotFoundException('Test template not found');
    // }

    // const newTestQuestion = this.testQuestionRepository.create({
    //   testTemplate,
    //   question: savedQuestion,
    // });

    // await this.testQuestionRepository.save(newTestQuestion);

    return savedQuestion;
  }

  async findAllWithOptions(filters?: {
    topic?: 'Vocabulary' | 'Grammar';
    vocabulary_topic?: 'IT' | 'Business' | 'Finance';
    grammar_topic?: 'Tense' | 'Passive Voice' | 'Conditional Sentence';
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
  }) {
    return this.questionRepository.find({
      where: {
        ...(filters?.topic ? { topic: filters.topic } : {}),
        ...(filters?.vocabulary_topic ? { vocabulary_topic: filters.vocabulary_topic } : {}),
        ...(filters?.grammar_topic ? { grammar_topic: filters.grammar_topic } : {}),
        ...(filters?.level ? { level: filters.level } : {}),
      },
      relations: ['options'],
    });
  }
  

  async findOne(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      select: ['id', 'topic', 'vocabulary_topic', 'grammar_topic', 'level', 'question_text'],
    });
  
    if (!question) {
      throw new NotFoundException('Question not found');
    }
  
    return question;
  }
  
  async findOneWithOptions(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['options'],
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async findAllFiltered(filters: {
    topic?: 'Vocabulary' | 'Grammar',
    vocabulary_topic?: 'IT' | 'Business' | 'Finance',
    grammar_topic?: 'Tense' | 'Passive Voice' | 'Conditional Sentence',
    level?: 'Beginner' | 'Intermediate' | 'Advanced',
  }) {
    const queryBuilder = this.questionRepository.createQueryBuilder('question');
  
    if (filters.topic) {
      queryBuilder.andWhere('question.topic = :topic', { topic: filters.topic });
    }
    if (filters.vocabulary_topic) {
      queryBuilder.andWhere('question.vocabulary_topic = :vocabulary_topic', { vocabulary_topic: filters.vocabulary_topic });
    }
    if (filters.grammar_topic) {
      queryBuilder.andWhere('question.grammar_topic = :grammar_topic', { grammar_topic: filters.grammar_topic });
    }
    if (filters.level) {
      queryBuilder.andWhere('question.level = :level', { level: filters.level });
    }
  
    return queryBuilder.select([
      'question.id',
      'question.topic',
      'question.vocabulary_topic',
      'question.grammar_topic',
      'question.level',
      'question.question_text'
    ]).getMany();
  }
  

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepository.preload({
      id,
      ...updateQuestionDto,
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return this.questionRepository.save(question);
  }

  async remove(id: number) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    await this.questionRepository.remove(question);
    return { message: 'Question deleted successfully' };
  }
}
