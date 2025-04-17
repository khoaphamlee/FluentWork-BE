import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestAnswersService } from './test-answers.service';
import { CreateTestAnswerDto } from './dto/create-test-answer.dto';
import { UpdateTestAnswerDto } from './dto/update-test-answer.dto';

@Controller('test-answers')
export class TestAnswersController {
  constructor(private readonly testAnswersService: TestAnswersService) {}

  @Post()
  create(@Body() createTestAnswerDto: CreateTestAnswerDto) {
    return this.testAnswersService.create(createTestAnswerDto);
  }

  @Get()
  findAll() {
    return this.testAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testAnswersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestAnswerDto: UpdateTestAnswerDto) {
    return this.testAnswersService.update(+id, updateTestAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testAnswersService.remove(+id);
  }
}
