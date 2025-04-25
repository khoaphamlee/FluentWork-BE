import { Injectable } from '@nestjs/common';
import { CreateLessonQaAnswerDto } from './dto/create-lesson-qa-answer.dto';
import { UpdateLessonQaAnswerDto } from './dto/update-lesson-qa-answer.dto';

@Injectable()
export class LessonQaAnswersService {
  create(createLessonQaAnswerDto: CreateLessonQaAnswerDto) {
    return 'This action adds a new lessonQaAnswer';
  }

  findAll() {
    return `This action returns all lessonQaAnswers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonQaAnswer`;
  }

  update(id: number, updateLessonQaAnswerDto: UpdateLessonQaAnswerDto) {
    return `This action updates a #${id} lessonQaAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonQaAnswer`;
  }
}
