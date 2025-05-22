import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Topic } from 'src/enum/topic.enum';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { Level } from 'src/enum/level.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { LessonQuestion } from 'src/lesson-questions/entities/lesson-question.entity';
import { Question } from 'src/questions/entities/question.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(LessonQuestion)
    private readonly lessonQuestionRepository: Repository<LessonQuestion>,
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
    
    const savedLesson = await this.lessonRepository.save(lesson);

    await this.generateQuestionsForLesson(savedLesson.id);
  
    const lessonWithQuestions = await this.lessonRepository.findOne({
        where: { id: savedLesson.id },
        relations: ['lessonQuestions', 'lessonQuestions.question'],
    });

    if (!lessonWithQuestions) {
        throw new NotFoundException(`Lesson with ID ${savedLesson.id} not found after creation`);
    }

    return lessonWithQuestions;

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

    async findAllFiltered(filters: {
    type?: Topic;
    vocabulary_topic?: VocabularyTopic;
    grammar_topic?: GrammarTopic;
    level?: Level;
    }): Promise<Lesson[]> {
    const queryBuilder = this.lessonRepository.createQueryBuilder('lesson');

    if (filters.type) {
        queryBuilder.andWhere('lesson.type = :type', { type: filters.type });
    }
    if (filters.vocabulary_topic) {
        queryBuilder.andWhere('lesson.vocabulary_topic = :vocabulary_topic', {
        vocabulary_topic: filters.vocabulary_topic,
        });
    }
    if (filters.grammar_topic) {
        queryBuilder.andWhere('lesson.grammar_topic = :grammar_topic', {
        grammar_topic: filters.grammar_topic,
        });
    }
    if (filters.level) {
        queryBuilder.andWhere('lesson.level = :level', {
        level: filters.level,
        });
    }

    return queryBuilder
        .select([
        'lesson.id',
        'lesson.title',
        'lesson.type',
        'lesson.vocabulary_topic',
        'lesson.grammar_topic',
        'lesson.level',
        'lesson.defaultOrder',
        ])
        .orderBy('lesson.defaultOrder', 'ASC')
        .getMany();
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

  async generateQuestionsForLesson(lessonId: number): Promise<void> {
    const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });

    if (!lesson) {
        throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    const where: any = {
        type: lesson.type,
        level: lesson.level,
    };

    if (lesson.type === Topic.VOCABULARY) {
        where.vocabulary_topic = lesson.vocabulary_topic;
    } else if (lesson.type === Topic.GRAMMAR) {
        where.grammar_topic = lesson.grammar_topic;
    }

    const questions = await this.questionRepository.find({
        where,
        take: 5,
    });

    if (questions.length < 5) {
        throw new Error(`Not enough questions. Need 5, got ${questions.length}`);
    }

    for (const question of questions) {
        await this.lessonQuestionRepository.save({
        lesson,
        question,
        });
    }
}

}
