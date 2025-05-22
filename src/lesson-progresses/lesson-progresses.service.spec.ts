import { Test, TestingModule } from '@nestjs/testing';
import { LessonProgressService } from './lesson-progresses.service';

describe('LessonProgressesService', () => {
  let service: LessonProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonProgressService],
    }).compile();

    service = module.get<LessonProgressService>(LessonProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
