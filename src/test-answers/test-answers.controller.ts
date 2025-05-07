import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { TestAnswersService } from './test-answers.service';
import { CreateTestAnswerDto } from './dto/create-test-answer.dto';
import { UpdateTestAnswerDto } from './dto/update-test-answer.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('test-answers')
export class TestAnswersController {
  constructor(private readonly testAnswersService: TestAnswersService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createTestAnswerDto: CreateTestAnswerDto) {
    return await this.testAnswersService.create(createTestAnswerDto);
  }

  @Get()
  async findAll() {
    return await this.testAnswersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const testAnswer = await this.testAnswersService.findOne(+id);
    if (!testAnswer) {
      throw new NotFoundException(`TestAnswer with id ${id} not found`);
    }
    return testAnswer;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) updateTestAnswerDto: UpdateTestAnswerDto) {
    const updatedTestAnswer = await this.testAnswersService.update(+id, updateTestAnswerDto);
    if (!updatedTestAnswer) {
      throw new NotFoundException(`TestAnswer with id ${id} not found`);
    }
    return updatedTestAnswer;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.testAnswersService.remove(+id);
    if (!result) {
      throw new NotFoundException(`TestAnswer with id ${id} not found`);
    }
    return { message: `TestAnswer with id ${id} has been deleted successfully` };
  }
}
