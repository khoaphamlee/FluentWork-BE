import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const question = this.questionRepository.create(createQuestionDto);
    return await this.questionRepository.save(question);
  }

  async findAll() {
    return await this.questionRepository.find({
      relations: ['options'],
    });
  }

  async findOne(id: number) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepository.preload({
      id,
      ...updateQuestionDto,
    });
    if (!question) throw new NotFoundException('Question not found');
    return await this.questionRepository.save(question);
  }

  async remove(id: number) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    await this.questionRepository.remove(question);
    return { message: 'Question deleted successfully' };
  }
}
