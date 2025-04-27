import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonQuestionsService } from './lesson-questions.service';
import { CreateLessonQuestionDto } from './dto/create-lesson-question.dto';
import { UpdateLessonQuestionDto } from './dto/update-lesson-question.dto';

@Controller('lesson-questions')
export class LessonQuestionsController {
  constructor(private readonly lessonQuestionsService: LessonQuestionsService) {}

  @Post()
  create(@Body() createLessonQuestionDto: CreateLessonQuestionDto) {
    return this.lessonQuestionsService.create(createLessonQuestionDto);
  }

  @Get()
  findAll() {
    return this.lessonQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonQuestionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonQuestionDto: UpdateLessonQuestionDto) {
    return this.lessonQuestionsService.update(+id, updateLessonQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonQuestionsService.remove(+id);
  }
}
