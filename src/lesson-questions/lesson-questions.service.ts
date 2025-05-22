import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonQuestion } from './entities/lesson-question.entity';
import { CreateLessonQuestionDto } from './dto/create-lesson-question.dto';
import { UpdateLessonQuestionDto } from './dto/update-lesson-question.dto';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Topic } from 'src/enum/topic.enum';
import { Level } from 'src/enum/level.enum';

@Injectable()
export class LessonQuestionsService {
  constructor(
    @InjectRepository(LessonQuestion)
    private lessonQuestionRepository: Repository<LessonQuestion>,

    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createDto: CreateLessonQuestionDto): Promise<LessonQuestion> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: createDto.lesson_id },
    });
    if (!lesson) throw new NotFoundException(`Lesson with id ${createDto.lesson_id} not found`);

    const question = await this.questionRepository.findOne({
      where: { id: createDto.question_id },
    });
    if (!question) throw new NotFoundException(`Question with id ${createDto.question_id} not found`);

    const lessonQuestion = this.lessonQuestionRepository.create({
      lesson,
      question,
    });

    return this.lessonQuestionRepository.save(lessonQuestion);
  }

  async findAll(): Promise<LessonQuestion[]> {
    return this.lessonQuestionRepository.find({
      relations: ['lesson', 'question', 'lessonAnswers'],
    });
  }

  async findOne(id: number): Promise<LessonQuestion> {
    const lessonQuestion = await this.lessonQuestionRepository.findOne({
      where: { id },
      relations: ['lesson', 'question', 'lessonAnswers'],
    });
    if (!lessonQuestion) throw new NotFoundException(`LessonQuestion with id ${id} not found`);
    return lessonQuestion;
  }

  async update(id: number, updateDto: UpdateLessonQuestionDto): Promise<LessonQuestion> {
    const lessonQuestion = await this.lessonQuestionRepository.findOne({ where: { id } });
    if (!lessonQuestion) throw new NotFoundException(`LessonQuestion with id ${id} not found`);

    if (updateDto.question_id) {
      const question = await this.questionRepository.findOne({
        where: { id: updateDto.question_id },
      });
      if (!question) throw new NotFoundException(`Question with id ${updateDto.question_id} not found`);
      lessonQuestion.question = question;
    }

    return this.lessonQuestionRepository.save(lessonQuestion);
  }

  async remove(id: number): Promise<void> {
    const lessonQuestion = await this.lessonQuestionRepository.findOne({ where: { id } });
    if (!lessonQuestion) throw new NotFoundException(`LessonQuestion with id ${id} not found`);

    await this.lessonQuestionRepository.remove(lessonQuestion);
  }

}
