import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LessonQuestionsService } from './lesson-questions.service';
import { CreateLessonQuestionDto } from './dto/create-lesson-question.dto';
import { UpdateLessonQuestionDto } from './dto/update-lesson-question.dto';

@ApiTags('Lesson Questions')
@Controller('lesson-questions')
export class LessonQuestionsController {
  constructor(private readonly lessonQuestionsService: LessonQuestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a LessonQuestion' })
  @ApiResponse({ status: 201, description: 'LessonQuestion created successfully' })
  async create(@Body() dto: CreateLessonQuestionDto) {
    const data = await this.lessonQuestionsService.create(dto);
    return {
      message: 'LessonQuestion created successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all LessonQuestions' })
  @ApiResponse({ status: 200, description: 'List of LessonQuestions' })
  async findAll() {
    const data = await this.lessonQuestionsService.findAll();
    return {
      message: 'List of LessonQuestions',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one LessonQuestion by ID' })
  @ApiResponse({ status: 200, description: 'LessonQuestion details' })
  async findOne(@Param('id') id: string) {
    const data = await this.lessonQuestionsService.findOne(+id);
    return {
      message: `LessonQuestion #${id} details`,
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update LessonQuestion' })
  @ApiResponse({ status: 200, description: 'LessonQuestion updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLessonQuestionDto,
  ) {
    const data = await this.lessonQuestionsService.update(+id, dto);
    return {
      message: `LessonQuestion #${id} updated successfully`,
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a LessonQuestion by ID' })
  @ApiResponse({ status: 204, description: 'LessonQuestion deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.lessonQuestionsService.remove(+id);
  }

}
