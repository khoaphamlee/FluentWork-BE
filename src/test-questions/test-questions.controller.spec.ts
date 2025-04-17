import { Test, TestingModule } from '@nestjs/testing';
import { TestQuestionsController } from './test-questions.controller';
import { TestQuestionsService } from './test-questions.service';

describe('TestQuestionsController', () => {
  let controller: TestQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestQuestionsController],
      providers: [TestQuestionsService],
    }).compile();

    controller = module.get<TestQuestionsController>(TestQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
