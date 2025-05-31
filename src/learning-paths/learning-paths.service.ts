import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';
import { LearningPath } from './entities/learning-path.entity';
import { LearningPathLesson } from 'src/learning-path-lessons/entities/learning-path-lesson.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Topic } from 'src/enum/topic.enum';

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
  // Tạo LearningPath
  const learningPath = await this.learningPathRepository.save({
    level: dto.level,
    title: dto.title,
    description: dto.description,
    topics: dto.topics, // sửa 'topic' thành 'topics'
    user: { id: userId },
  });

  // Lấy tất cả lessons theo level
  const lessons = await this.lessonRepository.find({
    where: { level: dto.level }, // nếu dùng quan hệ
  });

  // Lọc lessons theo topics được chọn
  const filteredLessons = lessons.filter((lesson) => {
  const grammarTopic = lesson.grammar_topic;
  const vocabTopic = lesson.vocabulary_topic;

  return (
    (lesson.type === Topic.GRAMMAR && grammarTopic && dto.topics.some(topic => topic.toLowerCase() === grammarTopic.toLowerCase())) ||
    (lesson.type === Topic.VOCABULARY && vocabTopic && dto.topics.some(topic => topic.toLowerCase() === vocabTopic.toLowerCase()))
  );
});



    console.log('dto.topics:', dto.topics);
    console.log('lessons:', lessons.map(l => ({
    id: l.id,
    type: l.type,
    grammar_topic: l.grammar_topic,
    vocabulary_topic: l.vocabulary_topic
    })));

  console.log('Filtered lessons:', filteredLessons);

  // Tạo các bản ghi LearningPathLesson tương ứng
  const learningPathLessons = filteredLessons.map((lesson, index) => {
    const topic =
      lesson.type === Topic.GRAMMAR
        ? lesson.grammar_topic ?? 'Unknown'
        : lesson.vocabulary_topic ?? 'Unknown';

    return this.learningPathLessonRepository.create({
      learningPath, // Truyền đúng object LearningPath
      lesson,
      type: lesson.type,
      topic: String(topic), // ép kiểu sang string
      order: index + 1,
    });
  });

  // Lưu các bản ghi LearningPathLesson
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
