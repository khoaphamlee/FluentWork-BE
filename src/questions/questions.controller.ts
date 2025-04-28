import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Question } from './entities/question.entity';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @ApiOperation({ summary: 'Create a new question' })
    @ApiResponse({
        status: 201,
        description: 'The question has been successfully created.',
        type: Question,
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Post()
    create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionsService.create(createQuestionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all questions with optional filters' })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved all questions.',
        type: [Question],
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    findAll(
        @Query('topic') topic?: 'Vocabulary' | 'Grammar',
        @Query('vocabulary_topic') vocabulary_topic?: 'IT' | 'Business' | 'Finance',
        @Query('grammar_topic') grammar_topic?: 'Tense' | 'Passive Voice' | 'Conditional Sentence',
        @Query('level') level?: 'Beginner' | 'Intermediate' | 'Advanced',
    ) {
        return this.questionsService.findAllFiltered({ topic, vocabulary_topic, grammar_topic, level });
    }

    @Get('options')
    @ApiOperation({ summary: 'Get all questions with options, with optional filters' })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved all questions with options.',
        type: [Question],
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    findAllWithOption(
        @Query('topic') topic?: 'Vocabulary' | 'Grammar',
        @Query('vocabulary_topic') vocabulary_topic?: 'IT' | 'Business' | 'Finance',
        @Query('grammar_topic') grammar_topic?: 'Tense' | 'Passive Voice' | 'Conditional Sentence',
        @Query('level') level?: 'Beginner' | 'Intermediate' | 'Advanced',
    ) {
        return this.questionsService.findAllWithOptions({ topic, vocabulary_topic, grammar_topic, level });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific question by ID' })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved the question.',
        type: Question,
    })
    @ApiResponse({ status: 404, description: 'Question not found' })
    findOne(@Param('id') id: string) {
        return this.questionsService.findOne(+id);
    }

    @Get(':id/options')
    @ApiOperation({ summary: 'Get the options for a specific question by ID' })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved the question options.',
        type: Question,
    })
    @ApiResponse({ status: 404, description: 'Question not found' })
    findOneWithOption(@Param('id') id: number) {
        return this.questionsService.findOneWithOptions(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a question by ID' })
    @ApiResponse({
        status: 200,
        description: 'Successfully updated the question.',
        type: Question,
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'Question not found' })
    update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionsService.update(+id, updateQuestionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a question by ID' })
    @ApiResponse({
        status: 200,
        description: 'Successfully deleted the question.',
    })
    @ApiResponse({ status: 404, description: 'Question not found' })
    remove(@Param('id') id: string) {
        return this.questionsService.remove(+id);
    }
}
