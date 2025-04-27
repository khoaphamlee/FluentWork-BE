import { Test, TestingModule } from '@nestjs/testing';
import { LessonQaAnswersService } from './lesson-qa-answers.service';

describe('LessonQaAnswersService', () => {
  let service: LessonQaAnswersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonQaAnswersService],
    }).compile();

    service = module.get<LessonQaAnswersService>(LessonQaAnswersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
