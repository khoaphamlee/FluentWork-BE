import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestMistakesService } from './test-mistakes.service';
import { CreateTestMistakeDto } from './dto/create-test-mistake.dto';
import { UpdateTestMistakeDto } from './dto/update-test-mistake.dto';

@Controller('test-mistakes')
export class TestMistakesController {
  constructor(private readonly testMistakesService: TestMistakesService) {}

  @Post()
  create(@Body() createTestMistakeDto: CreateTestMistakeDto) {
    return this.testMistakesService.create(createTestMistakeDto);
  }

  @Get()
  findAll() {
    return this.testMistakesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testMistakesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestMistakeDto: UpdateTestMistakeDto) {
    return this.testMistakesService.update(+id, updateTestMistakeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testMistakesService.remove(+id);
  }
}
