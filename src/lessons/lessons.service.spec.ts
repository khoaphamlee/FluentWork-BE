import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { Question } from '../questions/entities/question.entity';
import { LessonQuestion } from '../lesson-questions/entities/lesson-question.entity';
import { Topic } from '../enum/topic.enum';
import { Level } from '../enum/level.enum';
import { VocabularyTopic } from '../enum/vocabulary-topic.enum';
import { LessonsService } from './lessons.service';
import { LearningPathLessonsService } from 'src/learning-path-lessons/learning-path-lessons.service';
import { LearningPathLesson } from 'src/learning-path-lessons/entities/learning-path-lesson.entity';

const mockLessonRepository = () => ({
  count: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockQuestionRepository = () => ({
  find: jest.fn(),
});

const mockLessonQuestionRepository = () => ({
  save: jest.fn(),
});

describe('LessonService', () => {
  let service: LessonsService;
  let lessonRepo: ReturnType<typeof mockLessonRepository>;
  let questionRepo: ReturnType<typeof mockQuestionRepository>;
  let lessonQuestionRepo: ReturnType<typeof mockLessonQuestionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService, LearningPathLessonsService,
        { provide: getRepositoryToken(Lesson), useFactory: mockLessonRepository },
        { provide: getRepositoryToken(Question), useFactory: mockQuestionRepository },
        { provide: getRepositoryToken(LessonQuestion), useFactory: mockLessonQuestionRepository },
        { provide: getRepositoryToken(LearningPathLesson), useValue: { find: jest.fn(), save: jest.fn()}}
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    lessonRepo = module.get(getRepositoryToken(Lesson));
    questionRepo = module.get(getRepositoryToken(Question));
    lessonQuestionRepo = module.get(getRepositoryToken(LessonQuestion));
  });

  describe('create()', () => {
    const dto = {
      title: 'Vocabulary 1',
      description: 'Description',
      level: Level.BEGINNER,
      type: Topic.VOCABULARY,
      vocabulary_topic: VocabularyTopic.BUSINESS,
      grammar_topic: null,
      content: 'Some content',
    };

    it('should create and return a lesson with questions', async () => {
      // Arrange
      const createdLesson = { ...dto, id: 1, defaultOrder: 1 };
      const savedLesson = { ...createdLesson };

      lessonRepo.count.mockResolvedValue(0);
      lessonRepo.create.mockReturnValue(createdLesson);
      lessonRepo.save.mockResolvedValue(savedLesson);
      lessonRepo.findOne.mockResolvedValue({ ...savedLesson, lessonQuestions: [] });

      const mockQuestions = [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
      ];
      questionRepo.find.mockResolvedValue(mockQuestions);
      lessonQuestionRepo.save.mockResolvedValue({});

      // Act
      const result = await service.create(dto);

      // Assert
      expect(lessonRepo.count).toHaveBeenCalledWith({
        where: {
          type: dto.type,
          level: dto.level,
          vocabulary_topic: dto.vocabulary_topic,
        },
      });

      expect(lessonRepo.create).toHaveBeenCalledWith({
        ...dto,
        defaultOrder: 1,
      });

      expect(lessonRepo.save).toHaveBeenCalledWith(createdLesson);

      expect(questionRepo.find).toHaveBeenCalledWith({
        where: {
          type: dto.type,
          level: dto.level,
          vocabulary_topic: dto.vocabulary_topic,
        },
        take: 5,
      });

      expect(result).toHaveProperty('lessonQuestions');
    });

    it('should throw error if not enough questions', async () => {
      lessonRepo.count.mockResolvedValue(0);
      lessonRepo.create.mockReturnValue({ ...dto, id: 1 });
      lessonRepo.save.mockResolvedValue({ ...dto, id: 1 });
      lessonRepo.findOne.mockResolvedValue({ ...dto, id: 1 });

      questionRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]); // < 5

      await expect(service.create(dto)).rejects.toThrow('Not enough questions');
    });

    it('should throw NotFoundException if lesson not found after save', async () => {
      lessonRepo.count.mockResolvedValue(0);
      lessonRepo.create.mockReturnValue({ ...dto, id: 1 });
      lessonRepo.save.mockResolvedValue({ ...dto, id: 1 });
      lessonRepo.findOne.mockResolvedValue(null);

      questionRepo.find.mockResolvedValue([
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
      ]);

      await expect(service.create(dto)).rejects.toThrow('Lesson with ID 1 not found');
    });
  });
});
