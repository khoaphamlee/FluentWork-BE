import { Test, TestingModule } from '@nestjs/testing';
import { TestAnswersService } from './test-answers.service';

describe('TestAnswersService', () => {
  let service: TestAnswersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestAnswersService],
    }).compile();

    service = module.get<TestAnswersService>(TestAnswersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
