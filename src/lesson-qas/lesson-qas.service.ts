import { Injectable } from '@nestjs/common';
import { CreateLessonQaDto } from './dto/create-lesson-qa.dto';
import { UpdateLessonQaDto } from './dto/update-lesson-qa.dto';

@Injectable()
export class LessonQasService {
  create(createLessonQaDto: CreateLessonQaDto) {
    return 'This action adds a new lessonQa';
  }

  findAll() {
    return `This action returns all lessonQas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonQa`;
  }

  update(id: number, updateLessonQaDto: UpdateLessonQaDto) {
    return `This action updates a #${id} lessonQa`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonQa`;
  }
}
