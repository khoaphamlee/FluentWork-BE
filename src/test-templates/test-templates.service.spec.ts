import { Test, TestingModule } from '@nestjs/testing';
import { TestTemplatesService } from './test-templates.service';

describe('TestTemplatesService', () => {
  let service: TestTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestTemplatesService],
    }).compile();

    service = module.get<TestTemplatesService>(TestTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
