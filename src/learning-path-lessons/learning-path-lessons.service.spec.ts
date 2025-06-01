import { Test, TestingModule } from '@nestjs/testing';
import { LearningPathLessonsService } from './learning-path-lessons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LearningPathLesson } from './entities/learning-path-lesson.entity';
import { Repository } from 'typeorm';

describe('LearningPathLessonsService', () => {
  let service: LearningPathLessonsService;
  let repo: Repository<LearningPathLesson>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningPathLessonsService,
        {
          provide: getRepositoryToken(LearningPathLesson),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<LearningPathLessonsService>(LearningPathLessonsService);
    repo = module.get<Repository<LearningPathLesson>>(getRepositoryToken(LearningPathLesson));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
