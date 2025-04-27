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
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
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
  async getTestQuestions(@Param('testId') testId: number) {
    if (isNaN(testId)) {
      throw new BadRequestException('Invalid ID provided');
    }

    const test = await this.testRepository.findOne({
      where: { id: testId },
      relations: ['testTemplate'],
    });

    if (!test) {
      throw new NotFoundException(`Test with id ${testId} not found`);
    }

    const testTemplateId = test.testTemplate.id;
    const template =
      await this.testTemplateService.getTemplateWithQuestions(testTemplateId);

    if (!template) {
      throw new NotFoundException(
        `Test Template with id ${testTemplateId} not found`,
      );
    }

    return template.questions.map((q) => ({
      questionId: q.question.id,
      questionText: q.question.question_text,
      options: q.question.options,
      difficulty: q.question.level,
      topic: q.question.topic,
      category: q.question.vocabulary_topic,
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
