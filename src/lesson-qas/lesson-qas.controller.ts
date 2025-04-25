import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonQasService } from './lesson-qas.service';
import { CreateLessonQaDto } from './dto/create-lesson-qa.dto';
import { UpdateLessonQaDto } from './dto/update-lesson-qa.dto';

@Controller('lesson-qas')
export class LessonQasController {
  constructor(private readonly lessonQasService: LessonQasService) {}

  @Post()
  create(@Body() createLessonQaDto: CreateLessonQaDto) {
    return this.lessonQasService.create(createLessonQaDto);
  }

  @Get()
  findAll() {
    return this.lessonQasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonQasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonQaDto: UpdateLessonQaDto) {
    return this.lessonQasService.update(+id, updateLessonQaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonQasService.remove(+id);
  }
}
