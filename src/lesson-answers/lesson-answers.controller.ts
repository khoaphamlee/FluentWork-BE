import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonAnswersService } from './lesson-answers.service';
import { CreateLessonAnswerDto } from './dto/create-lesson-answer.dto';
import { UpdateLessonAnswerDto } from './dto/update-lesson-answer.dto';

@Controller('lesson-answers')
export class LessonAnswersController {
  constructor(private readonly lessonAnswersService: LessonAnswersService) {}

  @Post()
  create(@Body() createLessonAnswerDto: CreateLessonAnswerDto) {
    return this.lessonAnswersService.create(createLessonAnswerDto);
  }

  @Get()
  findAll() {
    return this.lessonAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonAnswersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonAnswerDto: UpdateLessonAnswerDto) {
    return this.lessonAnswersService.update(+id, updateLessonAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonAnswersService.remove(+id);
  }
}
