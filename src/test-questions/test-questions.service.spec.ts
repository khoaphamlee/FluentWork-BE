import { Test, TestingModule } from '@nestjs/testing';
import { TestQuestionsService } from './test-questions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestQuestion } from './entities/test-question.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Test as TestEntity } from 'src/tests/entities/test.entity';
import { Repository } from 'typeorm';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('TestQuestionsService', () => {
  let service: TestQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestQuestionsService,
        { provide: getRepositoryToken(TestQuestion), useFactory: mockRepo },
        { provide: getRepositoryToken(TestTemplate), useFactory: mockRepo },
        { provide: getRepositoryToken(Question), useFactory: mockRepo },
        { provide: getRepositoryToken(TestEntity), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<TestQuestionsService>(TestQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
