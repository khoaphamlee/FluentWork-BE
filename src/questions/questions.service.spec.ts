import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Option } from 'src/options/entities/option.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { Level } from 'src/enum/level.enum';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';

const mockQuestionRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

const mockOptionRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('QuestionsService', () => {
  let service: QuestionsService;
  let questionRepo: ReturnType<typeof mockQuestionRepository>;
  let optionRepo: ReturnType<typeof mockOptionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(Question),
          useFactory: mockQuestionRepository,
        },
        {
          provide: getRepositoryToken(Option),
          useFactory: mockOptionRepository,
        },
        {
          provide: getRepositoryToken(TestQuestion),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TestTemplate),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    questionRepo = module.get(getRepositoryToken(Question));
    optionRepo = module.get(getRepositoryToken(Option));
  });

  describe('create', () => {
    const createDto: CreateQuestionDto = {
      type: Topic.VOCABULARY,
      vocabulary_topic: VocabularyTopic.BUSINESS,
      grammar_topic: null,
      level: Level.BEGINNER,
      question_text: 'What is the synonym of "fast"?',
      explanation: 'Because "quick" means the same as "fast".',
      options: [
        { option_text: 'Quick', is_correct: true },
        { option_text: 'Slow', is_correct: false },
        { option_text: 'Heavy', is_correct: false },
        { option_text: 'Dark', is_correct: false },
      ],
    };

    it('should create a question with 4 options successfully', async () => {
      const fakeQuestion = { ...createDto, id: 1 };
      const fakeOptions = createDto.options.map((opt, index) => ({
        id: index + 1,
        ...opt,
        question: fakeQuestion,
      }));

      questionRepo.create.mockReturnValue(fakeQuestion);
      questionRepo.save.mockResolvedValue(fakeQuestion);

      optionRepo.create.mockImplementation((opt) => ({
        id: Math.floor(Math.random() * 1000),
        ...opt,
      }));

      optionRepo.save.mockImplementation((options) =>
        Promise.resolve(options.map((opt, i) => ({ ...opt, id: i + 1 })))
      );

      const result = await service.create(createDto);

      expect(questionRepo.create).toHaveBeenCalledWith({
        type: createDto.type,
        vocabulary_topic: createDto.vocabulary_topic,
        grammar_topic: createDto.grammar_topic,
        level: createDto.level,
        question_text: createDto.question_text,
        explanation: createDto.explanation,
      });
      expect(questionRepo.save).toHaveBeenCalledWith(fakeQuestion);

      createDto.options.forEach((opt) => {
        expect(optionRepo.create).toHaveBeenCalledWith({
          ...opt,
          question: fakeQuestion,
        });
      });

      expect(optionRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining(
          createDto.options.map((opt) =>
            expect.objectContaining({
              option_text: opt.option_text,
              is_correct: opt.is_correct,
              question: fakeQuestion,
            })
          )
        )
      );

      expect(result).toHaveProperty('options');
      expect(result.options).toHaveLength(4);
    });

    it('should throw an error if less than 4 options are provided', async () => {
      const invalidDto = {
        ...createDto,
        options: [
          { option_text: 'Quick', is_correct: true },
          { option_text: 'Slow', is_correct: false },
        ],
      };

      await expect(service.create(invalidDto)).rejects.toThrowError(
        'A question must have at least 4 options',
      );
    });

    it('should throw an error if no correct option is provided', async () => {
      const invalidDto = {
        ...createDto,
        options: createDto.options.map(opt => ({ ...opt, is_correct: false })),
      };

      await expect(service.create(invalidDto)).rejects.toThrowError(
        'At least one option must be marked as correct',
      );
    });
  });
});
