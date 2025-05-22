import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Lesson } from './entities/lesson.entity';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { Level } from 'src/enum/level.enum';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({
    status: 201,
    description: 'The lesson has been successfully created.',
    type: Lesson,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all lessons.',
    type: [Lesson],
  })
  @ApiQuery({ name: 'type', enum: Topic, required: false })
  @ApiQuery({ name: 'vocabulary_topic', enum: VocabularyTopic, required: false })
  @ApiQuery({ name: 'grammar_topic', enum: GrammarTopic, required: false })
  @ApiQuery({ name: 'level', enum: Level, required: false })
  findAll(
    @Query('type') type?: Topic,
    @Query('vocabulary_topic') vocabulary_topic?: VocabularyTopic,
    @Query('grammar_topic') grammar_topic?: GrammarTopic,
    @Query('level') level?: Level,
  ) {
    return this.lessonsService.findAllFiltered({
    type,
    vocabulary_topic,
    grammar_topic,
    level,
  });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific lesson by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the lesson.',
    type: Lesson,
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lesson by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the lesson.',
    type: Lesson,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the lesson.',
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.remove(id).then(() => ({
      message: `Lesson with ID ${id} deleted successfully.`,
    }));
  }

}
