import { Test, TestingModule } from '@nestjs/testing';
import { TestTemplatesController } from './test-templates.controller';
import { TestTemplatesService } from './test-templates.service';

describe('TestTemplatesController', () => {
  let controller: TestTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestTemplatesController],
      providers: [TestTemplatesService],
    }).compile();

    controller = module.get<TestTemplatesController>(TestTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
