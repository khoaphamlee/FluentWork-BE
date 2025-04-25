import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonQaAnswersService } from './lesson-qa-answers.service';
import { CreateLessonQaAnswerDto } from './dto/create-lesson-qa-answer.dto';
import { UpdateLessonQaAnswerDto } from './dto/update-lesson-qa-answer.dto';

@Controller('lesson-qa-answers')
export class LessonQaAnswersController {
  constructor(private readonly lessonQaAnswersService: LessonQaAnswersService) {}

  @Post()
  create(@Body() createLessonQaAnswerDto: CreateLessonQaAnswerDto) {
    return this.lessonQaAnswersService.create(createLessonQaAnswerDto);
  }

  @Get()
  findAll() {
    return this.lessonQaAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonQaAnswersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonQaAnswerDto: UpdateLessonQaAnswerDto) {
    return this.lessonQaAnswersService.update(+id, updateLessonQaAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonQaAnswersService.remove(+id);
  }
}
