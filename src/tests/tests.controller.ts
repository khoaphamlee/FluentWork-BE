import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { TestsService } from './tests.service';
  import { CreateTestDto } from './dto/create-test.dto';
  import { UpdateTestDto } from './dto/update-test.dto';
  import { TestTemplatesService } from 'src/test-templates/test-templates.service';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Test } from './entities/test.entity';
  import { Repository } from 'typeorm';
  
  @Controller('tests')
  export class TestsController {
    constructor(
      @InjectRepository(Test)
      private readonly testRepository: Repository<Test>,
      private readonly testsService: TestsService,
      private readonly testTemplateService: TestTemplatesService,
    ) {}
  
    @Post()
    create(@Body() createTestDto: CreateTestDto) {
      return this.testsService.create(createTestDto);
    }
  
    @Get()
    findAll() {
      return this.testsService.findAll();
    }
  
    @Get('question')
    findAllQuestion() {
      return this.testsService.findAllQuestion();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.testsService.findOne(+id);
    }
  
    @Get(':testId/questions')
    async getTestQuestions(@Param('testId') testId: string) {
    const id = parseInt(testId, 10);
    if (isNaN(id)) {
        throw new BadRequestException('Invalid ID provided');
    }

    const test = await this.testRepository.findOne({
        where: { id },
        relations: ['testQuestions', 'testQuestions.question'],
    });

    if (!test) {
        throw new NotFoundException(`Test with id ${id} not found`);
    }

    if (!test.testQuestions || test.testQuestions.length === 0) {
        throw new NotFoundException(`No questions found for test id ${id}`);
    }

    return test.testQuestions.map((tq) => ({
        questionId: tq.question.id,
        questionText: tq.question.question_text,
        options: tq.question.options,
        difficulty: tq.question.level,
        topic: tq.question.topic,
        category: tq.question.vocabulary_topic,
    }));
    }

  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
      return this.testsService.update(+id, updateTestDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.testsService.remove(+id);
    }
  }
  