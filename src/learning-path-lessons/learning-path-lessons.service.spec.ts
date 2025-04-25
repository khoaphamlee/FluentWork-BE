import { Test, TestingModule } from '@nestjs/testing';
import { LearningPathLessonsService } from './learning-path-lessons.service';

describe('LearningPathLessonsService', () => {
  let service: LearningPathLessonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearningPathLessonsService],
    }).compile();

    service = module.get<LearningPathLessonsService>(LearningPathLessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
