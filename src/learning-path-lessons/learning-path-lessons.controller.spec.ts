import { Test, TestingModule } from '@nestjs/testing';
import { LearningPathLessonsController } from './learning-path-lessons.controller';
import { LearningPathLessonsService } from './learning-path-lessons.service';

describe('LearningPathLessonsController', () => {
  let controller: LearningPathLessonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningPathLessonsController],
      providers: [LearningPathLessonsService],
    }).compile();

    controller = module.get<LearningPathLessonsController>(LearningPathLessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
