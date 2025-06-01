import { Test, TestingModule } from '@nestjs/testing';
import { TestsService } from './tests.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test as TestEntity } from './entities/test.entity';
import { TestTemplatesService } from '../test-templates/test-templates.service';
import { User } from '../users/entities/user.entity';
import { TestTemplate } from '../test-templates/entities/test-template.entity';
import { TestQuestion } from '../test-questions/entities/test-question.entity';
import { Question } from '../questions/entities/question.entity';
import { TestAnswer } from '../test-answers/entities/test-answer.entity';
import { LearnerProfile } from '../learner-profiles/entities/learner-profile.entity';
import { CreateTestDto } from './dto/create-test.dto';
import { Repository } from 'typeorm';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { Topic } from 'src/enum/topic.enum';
import { Level } from 'src/enum/level.enum';

describe('TestsService', () => {
  let service: TestsService;
  let testRepo: Repository<TestEntity>;
  let testTemplateService: TestTemplatesService;
  let testQuestionRepo: Repository<TestQuestion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsService,
        {
          provide: getRepositoryToken(TestEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TestTemplate),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TestQuestion),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Question),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TestAnswer),
          useValue: {},
        },
        {
          provide: getRepositoryToken(LearnerProfile),
          useValue: {},
        },
        {
          provide: TestTemplatesService,
          useValue: {
            getQuestionsByTemplate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TestsService>(TestsService);
    testRepo = module.get<Repository<TestEntity>>(getRepositoryToken(TestEntity));
    testTemplateService = module.get<TestTemplatesService>(TestTemplatesService);
    testQuestionRepo = module.get<Repository<TestQuestion>>(getRepositoryToken(TestQuestion));
  });

  describe('create()', () => {
    it('should create test and test questions', async () => {
      const user = { id: 1 } as User;

      const dto: CreateTestDto = {
        level: Level.BEGINNER,
        type: 'Vocabulary',
        duration: '15m',
        test_date: new Date(),
        vocabulary_topic: [VocabularyTopic.BUSINESS],
        grammar_topic: [],
        total_correct_answers: 0,
        total_incorrect_answers: 0,
      };

      const template: TestTemplate = {
        id: 1,
        title: 'Business Vocab Template',
        description: 'A test for business vocab',
        type: 'Vocabulary',
        vocabulary_topic: [VocabularyTopic.BUSINESS],
        grammar_topic: null,
        level: Level.BEGINNER,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        test: [],
        questions: [],
      };

      const test: TestEntity = {
        id: 100,
        user,
        testTemplate: template,
        score: 0,
        level: Level.BEGINNER,
        duration: dto.duration,
        test_date: dto.test_date,
        total_correct_answer: 0,
        total_incorrect_answer: 0,
        testQuestions: [],
        testMistakes: [],
      };

      const questions = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        type: Topic.VOCABULARY,
        vocabulary_topic: VocabularyTopic.BUSINESS,
        grammar_topic: null,
        level: Level.BEGINNER,
        question_text: `Question ${i + 1}`,
        explanation: 'Explanation',
        options: [],
        testQuestion: [],
        lessonQuestion: [],
        testTemplate: {} as any,
      })) as Question[];

      jest.spyOn<any, any>(service, 'findOrCreateTemplate').mockResolvedValue(template);
      jest.spyOn(testRepo, 'create').mockReturnValue(test);
      jest.spyOn(testRepo, 'save').mockResolvedValue(test);
      jest.spyOn(testTemplateService, 'getQuestionsByTemplate').mockResolvedValue(questions);
      jest.spyOn(testQuestionRepo, 'create').mockImplementation(
        (input) => ({ id: Date.now(), ...input }) as any,
      );
      jest.spyOn(testQuestionRepo, 'save').mockResolvedValue([] as any);
      jest.spyOn(testRepo, 'findOne').mockResolvedValue({ ...test, testQuestions: [] });

      const result = await service.create(user, dto);

      expect(result).toEqual(test);
      expect(testRepo.create).toBeCalledWith(expect.objectContaining({
        user: { id: 1 },
        level: Level.BEGINNER,
        duration: '15m',
      }));
      expect(testRepo.save).toBeCalled();
      expect(testQuestionRepo.save).toBeCalled();
    });
  });
});
