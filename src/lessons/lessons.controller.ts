import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
  } from '@nestjs/common';
  import { LessonsService } from './lessons.service';
  import { CreateLessonDto } from './dto/create-lesson.dto';
  import { UpdateLessonDto } from './dto/update-lesson.dto';
  
  @Controller('lessons')
  export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}
  
    @Post()
    async create(@Body() createLessonDto: CreateLessonDto) {
      return await this.lessonsService.create(createLessonDto);
    }
  
    @Get()
    async findAll() {
      return await this.lessonsService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
      return await this.lessonsService.findOne(id);
    }
  
    @Patch(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateLessonDto: UpdateLessonDto,
    ) {
      return await this.lessonsService.update(id, updateLessonDto);
    }
  
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
      await this.lessonsService.remove(id);
      return { message: `Lesson with id ${id} deleted successfully.` };
    }
  }
  