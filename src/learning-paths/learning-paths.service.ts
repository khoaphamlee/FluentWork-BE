import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';
import { LearningPath } from './entities/learning-path.entity';
import { LearningPathLesson } from 'src/learning-path-lessons/entities/learning-path-lesson.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Topic } from 'src/enum/topic.enum';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';

@Injectable()
export class LearningPathsService {
  constructor(
    @InjectRepository(LearningPath)
    private learningPathRepository: Repository<LearningPath>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LearningPathLesson)
    private readonly learningPathLessonRepository: Repository<LearningPathLesson>,
  ) {}

  async create(dto: CreateLearningPathDto, userId: number) {
  // Tự lấy grammar topic, không cần FE truyền
  const allGrammarTopics = Object.values(GrammarTopic);
  const allTopics = [...dto.vocabularyTopics, ...allGrammarTopics]; // Đây là topics lưu trong DB

  const learningPath = await this.learningPathRepository.save({
    level: dto.level,
    title: dto.title,
    description: dto.description,
    topics: allTopics, // Lưu cả vocab + grammar vào bảng learning_paths
    user: { id: userId },
  });

  const lessons = await this.lessonRepository.find({
    where: { level: dto.level },
  });

  const filteredLessons = lessons.filter((lesson) => {
    return (
      (lesson.type === Topic.GRAMMAR &&
        lesson.grammar_topic &&
        allGrammarTopics.includes(lesson.grammar_topic)) ||
      (lesson.type === Topic.VOCABULARY &&
        lesson.vocabulary_topic &&
        dto.vocabularyTopics.includes(lesson.vocabulary_topic))
    );
  });

  const learningPathLessons = filteredLessons.map((lesson, index) => {
    const topic =
      lesson.type === Topic.GRAMMAR
        ? lesson.grammar_topic ?? 'Unknown'
        : lesson.vocabulary_topic ?? 'Unknown';

    return this.learningPathLessonRepository.create({
      learningPath,
      lesson,
      type: lesson.type,
      topic: String(topic),
      order: index + 1,
    });
  });

  await this.learningPathLessonRepository.save(learningPathLessons);

  return learningPath;
}
async findByUser(userId: number): Promise<LearningPath> {
  const learningPath = await this.learningPathRepository.findOne({
    where: { user: { id: userId } },
    relations: ['learningPathLessons', 'learningPathLessons.lesson'],
  });

  if (!learningPath) {
    throw new Error(`Learning path for user ID ${userId} not found`);
  }

  return learningPath;
}

  async findAll(): Promise<LearningPath[]> {
    return await this.learningPathRepository.find();
  }

  async findOne(id: number): Promise<LearningPath> {
    const learningPath = await this.learningPathRepository.findOne({
      where: { id },
    });
    if (!learningPath) {
      throw new Error(`LearningPath with ID ${id} not found`);
    }
    return learningPath;
  }

  async update(id: number, updateLearningPathDto: UpdateLearningPathDto): Promise<LearningPath> {
    const learningPath = await this.findOne(id); 
    Object.assign(learningPath, updateLearningPathDto); 
    return await this.learningPathRepository.save(learningPath); 
  }

  async remove(id: number): Promise<void> {
    const learningPath = await this.findOne(id); 
    await this.learningPathRepository.remove(learningPath); 
  }

}
