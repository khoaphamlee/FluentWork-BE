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
    return await this.flashcardsRepository.save(flashcard);
  }

  async findAll(filters: FindFlashcardsDto): Promise<Flashcard[]> {
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

    return query.getMany();
  }

  async findOne(id: number) {
    const flashcard = await this.flashcardsRepository.findOne({
      where: { id },
    });
    if (!flashcard) {
      throw new NotFoundException('Không tìm thấy thẻ flashcard');
    }
    return flashcard;
  }

  async update(id: number, updateFlashcardDto: UpdateFlashcardDto) {
    const flashcard = await this.flashcardsRepository.findOne({
      where: { id },
    });
    if (!flashcard) {
      throw new NotFoundException('Không tìm thấy thẻ flashcard');
    }
    const updateFlashcard = Object.assign(flashcard, updateFlashcardDto);
    return await this.flashcardsRepository.save(updateFlashcard);
  }

  async remove(id: number) {
    const flashcard = await this.flashcardsRepository.findOne({
      where: { id },
    });
    if (!flashcard) {
      throw new NotFoundException('Không tìm thấy thẻ flashcard');
    }

    const removedUser = await this.flashcardsRepository.remove(flashcard);
    return new MessageResponseDto('Xóa flashcard thành công');
  }
}
