import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flashcard } from './entities/flashcard.entity';
import { Repository } from 'typeorm';
import { MessageResponseDto } from 'src/common/dto/message-response.dto';
import { FindFlashcardsDto } from './dto/find-flashcard.dto';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectRepository(Flashcard)
    private flashcardsRepository: Repository<Flashcard>,
  ) {}
  async create(createFlashcardDto: CreateFlashcardDto) {
    const flashcard = this.flashcardsRepository.create(createFlashcardDto);
    const saved = await this.flashcardsRepository.save(flashcard);

    const { ...returnFlashcard } = saved;

    return {
      message: ['Flashcard created successfully'],
      ...returnFlashcard,
    };
  }

  async findAll(
    filters: FindFlashcardsDto,
  ): Promise<{ message: string[]; flashcards: Flashcard[] }> {
    const query = this.flashcardsRepository.createQueryBuilder('flashcard');

    if (filters.topic) {
      query.andWhere('flashcard.topic = :topic', { topic: filters.topic });
    }

    if (filters.word) {
      query.andWhere('flashcard.word ILIKE :word', {
        word: `%${filters.word}%`,
      });
    }

    if (filters.definition) {
      query.andWhere('flashcard.definition ILIKE :definition', {
        definition: `%${filters.definition}%`,
      });
    }

    const flashcards = await query.getMany();

    return {
      message: ['Flashcards fetched successfully'],
      flashcards,
    };
  }

  async findOne(id: number) {
    const flashcard = await this.flashcardsRepository.findOne({
      where: { id },
    });

    if (!flashcard) {
      throw new NotFoundException(['Flashcard not found']);
    }

    return {
      message: ['Flashcard fetched successfully'],
      ...flashcard,
    };
  }

  async update(id: number, updateFlashcardDto: UpdateFlashcardDto) {
    const flashcard = await this.flashcardsRepository.findOne({
      where: { id },
    });

    if (!flashcard) {
      throw new NotFoundException(['Flashcard not found']);
    }

    const updatedFlashcard = Object.assign(flashcard, updateFlashcardDto);
    const saved = await this.flashcardsRepository.save(updatedFlashcard);

    return {
      message: ['Flashcard updated successfully'],
      ...saved,
    };
  }

  async remove(id: number) {
    const flashcard = await this.flashcardsRepository.findOne({
      where: { id },
    });

    if (!flashcard) {
      throw new NotFoundException(['Flashcard not found']);
    }

    await this.flashcardsRepository.remove(flashcard);

    return new MessageResponseDto('Flashcard removed successfully');
  }
}
