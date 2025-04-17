import { Test, TestingModule } from '@nestjs/testing';
import { TestAnswersController } from './test-answers.controller';
import { TestAnswersService } from './test-answers.service';

describe('TestAnswersController', () => {
  let controller: TestAnswersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestAnswersController],
      providers: [TestAnswersService],
    }).compile();

    controller = module.get<TestAnswersController>(TestAnswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
