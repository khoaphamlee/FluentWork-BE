import { Test, TestingModule } from '@nestjs/testing';
import { LessonQaAnswersController } from './lesson-qa-answers.controller';
import { LessonQaAnswersService } from './lesson-qa-answers.service';

describe('LessonQaAnswersController', () => {
  let controller: LessonQaAnswersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonQaAnswersController],
      providers: [LessonQaAnswersService],
    }).compile();

    controller = module.get<LessonQaAnswersController>(LessonQaAnswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
