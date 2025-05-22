import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonAnswersService } from './lesson-answers.service';
import { CreateLessonAnswerDto } from './dto/create-lesson-answer.dto';
import { UpdateLessonAnswerDto } from './dto/update-lesson-answer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Lesson Answers')
@Controller('lesson-answers')
export class LessonAnswersController {
  constructor(private readonly lessonAnswersService: LessonAnswersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lesson answer' })
  @ApiResponse({ status: 201, description: 'Lesson answer created successfully' })
  @ApiResponse({ status: 404, description: 'Lesson question or option not found' })
  create(@Body() createLessonAnswerDto: CreateLessonAnswerDto) {
    return this.lessonAnswersService.create(createLessonAnswerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lesson answers' })
  @ApiResponse({ status: 200, description: 'List of lesson answers returned successfully' })
  findAll() {
    return this.lessonAnswersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lesson answer by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Lesson answer returned successfully' })
  @ApiResponse({ status: 404, description: 'Lesson answer not found' })
  findOne(@Param('id') id: string) {
    return this.lessonAnswersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lesson answer by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Lesson answer updated successfully' })
  @ApiResponse({ status: 404, description: 'Lesson answer not found' })
  update(
    @Param('id') id: string,
    @Body() updateLessonAnswerDto: UpdateLessonAnswerDto,
  ) {
    return this.lessonAnswersService.update(+id, updateLessonAnswerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson answer by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Lesson answer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lesson answer not found' })
  remove(@Param('id') id: string) {
    return this.lessonAnswersService.remove(+id);
  }
}
