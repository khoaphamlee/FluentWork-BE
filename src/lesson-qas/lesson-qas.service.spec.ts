import { Test, TestingModule } from '@nestjs/testing';
import { LessonQasService } from './lesson-qas.service';

describe('LessonQasService', () => {
  let service: LessonQasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonQasService],
    }).compile();

    service = module.get<LessonQasService>(LessonQasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
