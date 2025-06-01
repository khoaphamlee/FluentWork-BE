import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flashcard } from './entities/flashcard.entity';
import { Repository } from 'typeorm';
import { FlashcardsService } from './flashcards.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

const mockFlashcardRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('FlashcardsService', () => {
  let service: FlashcardsService;
  let flashcardRepo: ReturnType<typeof mockFlashcardRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlashcardsService,
        {
          provide: getRepositoryToken(Flashcard),
          useFactory: mockFlashcardRepository,
        },
      ],
    }).compile();

    service = module.get<FlashcardsService>(FlashcardsService);
    flashcardRepo = module.get(getRepositoryToken(Flashcard));
  });

  describe('create', () => {
    const createDto: CreateFlashcardDto = {
      topic: VocabularyTopic.BUSINESS,
      word: 'Vaccine',
      definition: 'A substance used to stimulate immunity against diseases.',
    };

    it('should create and return a flashcard with a message', async () => {
      const fakeFlashcard = {
        id: 1,
        ...createDto,
      };

      // mock repo behavior
      flashcardRepo.create.mockReturnValue(fakeFlashcard);
      flashcardRepo.save.mockResolvedValue(fakeFlashcard);

      const result = await service.create(createDto);

      expect(flashcardRepo.create).toHaveBeenCalledWith(createDto);
      expect(flashcardRepo.save).toHaveBeenCalledWith(fakeFlashcard);

      expect(result).toEqual({
        message: ['Flashcard created successfully'],
        id: 1,
        topic: createDto.topic,
        word: createDto.word,
        definition: createDto.definition,
      });
    });
  });
});
