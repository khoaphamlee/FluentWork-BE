import { Test, TestingModule } from '@nestjs/testing';
import { LessonProgressesController } from './lesson-progresses.controller';
import { LessonProgressesService } from './lesson-progresses.service';

describe('LessonProgressesController', () => {
  let controller: LessonProgressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonProgressesController],
      providers: [LessonProgressesService],
    }).compile();

    controller = module.get<LessonProgressesController>(LessonProgressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
