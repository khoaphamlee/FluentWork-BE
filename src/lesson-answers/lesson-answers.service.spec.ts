import { Test, TestingModule } from '@nestjs/testing';
import { LessonAnswersService } from './lesson-answers.service';

describe('LessonAnswersService', () => {
  let service: LessonAnswersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonAnswersService],
    }).compile();

    service = module.get<LessonAnswersService>(LessonAnswersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
