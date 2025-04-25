import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LearningPathLessonsService } from './learning-path-lessons.service';
import { CreateLearningPathLessonDto } from './dto/create-learning-path-lesson.dto';
import { UpdateLearningPathLessonDto } from './dto/update-learning-path-lesson.dto';

@Controller('learning-path-lessons')
export class LearningPathLessonsController {
  constructor(private readonly learningPathLessonsService: LearningPathLessonsService) {}

  @Post()
  create(@Body() createLearningPathLessonDto: CreateLearningPathLessonDto) {
    return this.learningPathLessonsService.create(createLearningPathLessonDto);
  }

  @Get()
  findAll() {
    return this.learningPathLessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningPathLessonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearningPathLessonDto: UpdateLearningPathLessonDto) {
    return this.learningPathLessonsService.update(+id, updateLearningPathLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningPathLessonsService.remove(+id);
  }
}
