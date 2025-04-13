import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonProgressesService } from './lesson-progresses.service';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';

@Controller('lesson-progresses')
export class LessonProgressesController {
  constructor(private readonly lessonProgressesService: LessonProgressesService) {}

  @Post()
  create(@Body() createLessonProgressDto: CreateLessonProgressDto) {
    return this.lessonProgressesService.create(createLessonProgressDto);
  }

  @Get()
  findAll() {
    return this.lessonProgressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonProgressesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonProgressDto: UpdateLessonProgressDto) {
    return this.lessonProgressesService.update(+id, updateLessonProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonProgressesService.remove(+id);
  }
}
