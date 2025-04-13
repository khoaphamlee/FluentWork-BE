import { Test, TestingModule } from '@nestjs/testing';
import { LearningPathsController } from './learning-paths.controller';
import { LearningPathsService } from './learning-paths.service';

describe('LearningPathsController', () => {
  let controller: LearningPathsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningPathsController],
      providers: [LearningPathsService],
    }).compile();

    controller = module.get<LearningPathsController>(LearningPathsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
