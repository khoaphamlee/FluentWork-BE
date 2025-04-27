import { Test, TestingModule } from '@nestjs/testing';
import { TestMistakesController } from './test-mistakes.controller';
import { TestMistakesService } from './test-mistakes.service';

describe('TestMistakesController', () => {
  let controller: TestMistakesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestMistakesController],
      providers: [TestMistakesService],
    }).compile();

    controller = module.get<TestMistakesController>(TestMistakesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
