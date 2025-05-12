import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { faker } from '@faker-js/faker';
import { Option } from 'src/options/entities/option.entity';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { Level } from 'src/enum/level.enum';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(TestQuestion)
    private readonly testQuestionRepository: Repository<TestQuestion>,

    @InjectRepository(TestTemplate)
    private readonly testTemplateRepository: Repository<TestTemplate>,

    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const { options, ...questionData } = createQuestionDto;

    const newQuestion = this.questionRepository.create(questionData);
    const savedQuestion = await this.questionRepository.save(newQuestion);

    const optionEntities = options.map((opt) =>
        this.optionRepository.create({
        ...opt,
        question: savedQuestion,
        }),
    );

    await this.optionRepository.save(optionEntities);

    savedQuestion.options = optionEntities;
    return savedQuestion;
  }

  async findAllWithOptions(filters?: {
    type?: Topic;
    vocabulary_topic?: VocabularyTopic;
    grammar_topic?: GrammarTopic;
    level?: Level;
  }) {
    return this.questionRepository.find({
      where: {
        ...(filters?.type && { type: filters.type }),
        ...(filters?.vocabulary_topic && { vocabulary_topic: filters.vocabulary_topic }),
        ...(filters?.grammar_topic && { grammar_topic: filters.grammar_topic }),
        ...(filters?.level && { level: filters.level }),
      },
      relations: ['options'],
    });
  }
  
  async findOne(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      select: ['id', 'type', 'vocabulary_topic', 'grammar_topic', 'level', 'question_text'],
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
    type?: Topic;
    vocabulary_topic?: VocabularyTopic;
    grammar_topic?: GrammarTopic;
    level?: Level;
  }) {
    const queryBuilder = this.questionRepository.createQueryBuilder('question');
  
    if (filters.type) {
      queryBuilder.andWhere('question.type = :type', { type: filters.type });
    }
    if (filters.vocabulary_topic) {
      queryBuilder.andWhere('question.vocabulary_topic = :vocabulary_topic', {
        vocabulary_topic: filters.vocabulary_topic,
      });
    }
    if (filters.grammar_topic) {
      queryBuilder.andWhere('question.grammar_topic = :grammar_topic', {
        grammar_topic: filters.grammar_topic,
      });
    }
    if (filters.level) {
      queryBuilder.andWhere('question.level = :level', { level: filters.level });
    }
  
    return queryBuilder
      .select([
        'question.id',
        'question.type',
        'question.vocabulary_topic',
        'question.grammar_topic',
        'question.level',
        'question.question_text',
      ])
      .getMany();
  }
  

//   async update(id: number, updateQuestionDto: UpdateQuestionDto) {
//     const question = await this.questionRepository.preload({
//       id,
//       ...updateQuestionDto,
//     });
//     if (!question) {
//       throw new NotFoundException('Question not found');
//     }
//     return this.questionRepository.save(question);
//   }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const { options, ...questionData } = updateQuestionDto;

    const question = await this.questionRepository.findOne({
        where: { id },
        relations: ['options'],
    });

    if (!question) {
        throw new NotFoundException(`Question with id ${id} not found`);
    }

    this.questionRepository.merge(question, questionData);
    await this.questionRepository.save(question);

    if (options && options.length > 0) {
        for (const optionDto of options) {
        if (!optionDto.id) {
            throw new BadRequestException('Option id is required for update.');
        }

        const existingOption = await this.optionRepository.findOne({
            where: { id: optionDto.id, question: { id } },
        });

        if (!existingOption) {
            throw new NotFoundException(`Option with id ${optionDto.id} not found`);
        }

        this.optionRepository.merge(existingOption, optionDto);
        await this.optionRepository.save(existingOption);
        }
    }

    return await this.questionRepository.findOne({
        where: { id },
        relations: ['options'],
    });
    }

  async remove(id: number) {
    const question = await this.questionRepository.findOne({
        where: { id },
        relations: ['options'],
    });

    if (!question) {
        throw new NotFoundException('Question not found');
    }

    await this.optionRepository.remove(question.options);

    await this.questionRepository.remove(question);

    return { message: 'Question and associated options deleted successfully' };
    }


  async createFakeData(): Promise<void> {
    for (let i = 0; i < 10; i++) {
      const question = new Question();
  
      const type = faker.helpers.arrayElement(Object.values(Topic));
      question.type = type;
  
      if (type === Topic.VOCABULARY) {
        question.vocabulary_topic = faker.helpers.arrayElement(Object.values(VocabularyTopic));
        question.grammar_topic = null;
      } else {
        question.grammar_topic = faker.helpers.arrayElement(Object.values(GrammarTopic));
        question.vocabulary_topic = null;
      }
  
      question.level = faker.helpers.arrayElement(Object.values(Level));
      question.question_text = faker.lorem.sentence();
      question.explanation = faker.lorem.sentence();
  
      const savedQuestion = await this.questionRepository.save(question);
  
      const correctIndex = faker.number.int({ min: 0, max: 3 });
      const options: Option[] = [];
  
      for (let j = 0; j < 4; j++) {
        const option = new Option();
        option.option_text = faker.lorem.words(3);
        option.is_correct = j === correctIndex;
        option.question = savedQuestion;
  
        options.push(option);
      }
  
      await this.optionRepository.save(options);
    }
  
    console.log('✅ Đã tạo 10 câu hỏi và mỗi câu có 4 options!');
  }
}
