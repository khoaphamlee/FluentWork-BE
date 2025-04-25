import { Injectable } from '@nestjs/common';
import { CreateLessonQuestionDto } from './dto/create-lesson-question.dto';
import { UpdateLessonQuestionDto } from './dto/update-lesson-question.dto';

@Injectable()
export class LessonQuestionsService {
  create(createLessonQuestionDto: CreateLessonQuestionDto) {
    return 'This action adds a new lessonQuestion';
  }

  findAll() {
    return `This action returns all lessonQuestions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonQuestion`;
  }

  update(id: number, updateLessonQuestionDto: UpdateLessonQuestionDto) {
    return `This action updates a #${id} lessonQuestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonQuestion`;
  }
}
