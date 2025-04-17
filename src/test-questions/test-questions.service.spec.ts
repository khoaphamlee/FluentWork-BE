import { Test, TestingModule } from '@nestjs/testing';
import { TestQuestionsService } from './test-questions.service';

describe('TestQuestionsService', () => {
  let service: TestQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestQuestionsService],
    }).compile();

    service = module.get<TestQuestionsService>(TestQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
