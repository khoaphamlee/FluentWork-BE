import { Test, TestingModule } from '@nestjs/testing';
import { LessonQuestionsService } from './lesson-questions.service';

describe('LessonQuestionsService', () => {
  let service: LessonQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonQuestionsService],
    }).compile();

    service = module.get<LessonQuestionsService>(LessonQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
