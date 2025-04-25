import { Injectable } from '@nestjs/common';
import { CreateLessonAnswerDto } from './dto/create-lesson-answer.dto';
import { UpdateLessonAnswerDto } from './dto/update-lesson-answer.dto';

@Injectable()
export class LessonAnswersService {
  create(createLessonAnswerDto: CreateLessonAnswerDto) {
    return 'This action adds a new lessonAnswer';
  }

  findAll() {
    return `This action returns all lessonAnswers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonAnswer`;
  }

  update(id: number, updateLessonAnswerDto: UpdateLessonAnswerDto) {
    return `This action updates a #${id} lessonAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonAnswer`;
  }
}
