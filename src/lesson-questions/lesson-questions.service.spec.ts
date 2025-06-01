import { Test, TestingModule } from '@nestjs/testing';
import { LessonQuestionsService } from './lesson-questions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LessonQuestion } from './entities/lesson-question.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Repository } from 'typeorm';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('LessonQuestionsService', () => {
  let service: LessonQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonQuestionsService,
        { provide: getRepositoryToken(LessonQuestion), useFactory: mockRepo },
        { provide: getRepositoryToken(Lesson), useFactory: mockRepo },
        { provide: getRepositoryToken(Question), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<LessonQuestionsService>(LessonQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
