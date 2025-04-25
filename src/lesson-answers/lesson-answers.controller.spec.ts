import { Test, TestingModule } from '@nestjs/testing';
import { LessonAnswersController } from './lesson-answers.controller';
import { LessonAnswersService } from './lesson-answers.service';

describe('LessonAnswersController', () => {
  let controller: LessonAnswersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonAnswersController],
      providers: [LessonAnswersService],
    }).compile();

    controller = module.get<LessonAnswersController>(LessonAnswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
