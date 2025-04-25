import { Injectable } from '@nestjs/common';
import { CreateLearningPathLessonDto } from './dto/create-learning-path-lesson.dto';
import { UpdateLearningPathLessonDto } from './dto/update-learning-path-lesson.dto';

@Injectable()
export class LearningPathLessonsService {
  create(createLearningPathLessonDto: CreateLearningPathLessonDto) {
    return 'This action adds a new learningPathLesson';
  }

  findAll() {
    return `This action returns all learningPathLessons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learningPathLesson`;
  }

  update(id: number, updateLearningPathLessonDto: UpdateLearningPathLessonDto) {
    return `This action updates a #${id} learningPathLesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} learningPathLesson`;
  }
}
