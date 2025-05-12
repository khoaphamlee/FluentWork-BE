import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLearningPathLessonDto } from './dto/create-learning-path-lesson.dto';
import { UpdateLearningPathLessonDto } from './dto/update-learning-path-lesson.dto';
import { LearningPathLesson } from './entities/learning-path-lesson.entity';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

@Injectable()
export class LearningPathLessonsService {
  constructor(
    @InjectRepository(LearningPathLesson)
    private readonly learningPathLessonRepo: Repository<LearningPathLesson>,
  ) {}

  async create(dto: CreateLearningPathLessonDto) {
    if (
        dto.topic &&
        (
            (dto.type === Topic.GRAMMAR && !Object.values(GrammarTopic).includes(dto.topic as GrammarTopic)) ||
            (dto.type === Topic.VOCABULARY && !Object.values(VocabularyTopic).includes(dto.topic as VocabularyTopic))
        )
        ) {
        throw new BadRequestException('Topic does not match the selected type');
        }

    const lesson = this.learningPathLessonRepo.create(dto);
    return this.learningPathLessonRepo.save(lesson);
  }

  async findAll() {
    return this.learningPathLessonRepo.find({
      relations: ['learningPath', 'lesson'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number) {
    const item = await this.learningPathLessonRepo.findOne({
      where: { id },
      relations: ['learningPath', 'lesson'],
    });

    if (!item) {
      throw new NotFoundException(`LearningPathLesson #${id} not found`);
    }

    return item;
  }

  async update(id: number, dto: UpdateLearningPathLessonDto) {
    const lesson = await this.findOne(id);
    if (
        dto.topic &&
        (
            (dto.type === Topic.GRAMMAR && !Object.values(GrammarTopic).includes(dto.topic as GrammarTopic)) ||
            (dto.type === Topic.VOCABULARY && !Object.values(VocabularyTopic).includes(dto.topic as VocabularyTopic))
        )
        ) {
        throw new BadRequestException('Topic does not match the selected type');
        }

    Object.assign(lesson, dto);
    return this.learningPathLessonRepo.save(lesson);
  }

  async remove(id: number) {
    const lesson = await this.findOne(id);
    await this.learningPathLessonRepo.remove(lesson);
    return { message: `Deleted learningPathLesson #${id}` };
  }
}
