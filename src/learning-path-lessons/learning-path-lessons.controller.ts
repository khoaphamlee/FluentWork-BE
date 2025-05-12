import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LearningPathLessonsService } from './learning-path-lessons.service';
import { CreateLearningPathLessonDto } from './dto/create-learning-path-lesson.dto';
import { UpdateLearningPathLessonDto } from './dto/update-learning-path-lesson.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LearningPathLesson } from './entities/learning-path-lesson.entity';

@ApiTags('learning-path-lessons')
@Controller('learning-path-lessons')
export class LearningPathLessonsController {
  constructor(private readonly service: LearningPathLessonsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new learning path lesson' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a learning path lesson.',
    type: LearningPathLesson,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() dto: CreateLearningPathLessonDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all learning path lessons' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all learning path lessons.',
    type: [LearningPathLesson],
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific learning path lesson by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the learning path lesson.',
    type: LearningPathLesson,
  })
  @ApiResponse({ status: 404, description: 'Learning path lesson not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a learning path lesson by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the learning path lesson.',
    type: LearningPathLesson,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Learning path lesson not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLearningPathLessonDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a learning path lesson by ID' })
  @ApiResponse({
    status: 204,
    description: 'Successfully deleted the learning path lesson.',
  })
  @ApiResponse({ status: 404, description: 'Learning path lesson not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
