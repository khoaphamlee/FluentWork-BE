import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Topic } from 'src/enum/topic.enum';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const { type, vocabulary_topic, grammar_topic, level } = createLessonDto;
  
    const where: any = { type, level };
  
    if (type === Topic.VOCABULARY) {
      where.vocabulary_topic = vocabulary_topic;
    } else if (type === Topic.GRAMMAR) {
      where.grammar_topic = grammar_topic;
    }
  
    const count = await this.lessonRepository.count({ where });
  
    const lesson = this.lessonRepository.create({
      ...createLessonDto,
      defaultOrder: count + 1,
    });
  
    return await this.lessonRepository.save(lesson);
  }

  async findAll(): Promise<Lesson[]> {
    return await this.lessonRepository.find();
  }

  async findOne(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findOne(id);
    const updated = this.lessonRepository.merge(lesson, updateLessonDto);
    return await this.lessonRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.lessonRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
  }
}
