import { Test, TestingModule } from '@nestjs/testing';
import { TestMistakesService } from './test-mistakes.service';

describe('TestMistakesService', () => {
  let service: TestMistakesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestMistakesService],
    }).compile();

    service = module.get<TestMistakesService>(TestMistakesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
