import { Test, TestingModule } from '@nestjs/testing';
import { LessonQuestionsController } from './lesson-questions.controller';
import { LessonQuestionsService } from './lesson-questions.service';

describe('LessonQuestionsController', () => {
  let controller: LessonQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonQuestionsController],
      providers: [LessonQuestionsService],
    }).compile();

    controller = module.get<LessonQuestionsController>(LessonQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
