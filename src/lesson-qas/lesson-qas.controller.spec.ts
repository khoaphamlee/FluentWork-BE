import { Test, TestingModule } from '@nestjs/testing';
import { LessonQasController } from './lesson-qas.controller';
import { LessonQasService } from './lesson-qas.service';

describe('LessonQasController', () => {
  let controller: LessonQasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonQasController],
      providers: [LessonQasService],
    }).compile();

    controller = module.get<LessonQasController>(LessonQasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
