import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonAnswer } from './entities/lesson-answer.entity';
import { CreateLessonAnswerDto } from './dto/create-lesson-answer.dto';
import { UpdateLessonAnswerDto } from './dto/update-lesson-answer.dto';
import { LessonQuestion } from 'src/lesson-questions/entities/lesson-question.entity';
import { Option } from 'src/options/entities/option.entity';

@Injectable()
export class LessonAnswersService {
  constructor(
    @InjectRepository(LessonAnswer)
    private readonly lessonAnswerRepository: Repository<LessonAnswer>,

    @InjectRepository(LessonQuestion)
    private readonly lessonQuestionRepository: Repository<LessonQuestion>,

    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
  ) {}

  async create(createLessonAnswerDto: CreateLessonAnswerDto): Promise<LessonAnswer> {
    const { lesson_question_id, option_id, is_correct } = createLessonAnswerDto;

    const lessonQuestion = await this.lessonQuestionRepository.findOne({
      where: { id: lesson_question_id },
    });

    if (!lessonQuestion) {
      throw new NotFoundException(`LessonQuestion with ID ${lesson_question_id} not found`);
    }

    const option = await this.optionRepository.findOne({
      where: { id: option_id },
    });

    if (!option) {
      throw new NotFoundException(`Option with ID ${option_id} not found`);
    }

    const answer = this.lessonAnswerRepository.create({
      lessonQuestion,
      option,
      is_correct,
    });

    return await this.lessonAnswerRepository.save(answer);
  }

  async findAll(): Promise<LessonAnswer[]> {
    return this.lessonAnswerRepository.find({
      relations: ['lessonQuestion', 'option'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<LessonAnswer> {
    const answer = await this.lessonAnswerRepository.findOne({
      where: { id },
      relations: ['lessonQuestion', 'option'],
    });

    if (!answer) {
      throw new NotFoundException(`LessonAnswer with ID ${id} not found`);
    }

    return answer;
  }

  async update(id: number, updateLessonAnswerDto: UpdateLessonAnswerDto): Promise<LessonAnswer> {
    const answer = await this.findOne(id);

    const updated = this.lessonAnswerRepository.merge(answer, updateLessonAnswerDto);
    return await this.lessonAnswerRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.lessonAnswerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`LessonAnswer with ID ${id} not found`);
    }
  }
}
