import { Test, TestingModule } from '@nestjs/testing';
import { LessonProgressesService } from './lesson-progresses.service';

describe('LessonProgressesService', () => {
  let service: LessonProgressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonProgressesService],
    }).compile();

    service = module.get<LessonProgressesService>(LessonProgressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
