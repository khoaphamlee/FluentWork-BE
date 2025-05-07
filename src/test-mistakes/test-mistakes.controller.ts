import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { TestMistakesService } from './test-mistakes.service';
import { CreateTestMistakeDto } from './dto/create-test-mistake.dto';
import { UpdateTestMistakeDto } from './dto/update-test-mistake.dto';

@Controller('test-mistakes')
export class TestMistakesController {
  constructor(private readonly testMistakesService: TestMistakesService) {}

  @Post(':userId')
  async create(
    @Param('userId') userId: number,
    @Body() createTestMistakeDto: CreateTestMistakeDto,
  ) {
    return this.testMistakesService.create(createTestMistakeDto, userId);
  }

  @Get()
  findAll() {
    return this.testMistakesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const testMistake = await this.testMistakesService.findOne(+id);
    if (!testMistake) {
      throw new NotFoundException(`TestMistake with ID ${id} not found`);
    }
    return testMistake;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTestMistakeDto: UpdateTestMistakeDto) {
    const testMistake = await this.testMistakesService.update(+id, updateTestMistakeDto);
    if (!testMistake) {
      throw new NotFoundException(`TestMistake with ID ${id} not found`);
    }
    return testMistake;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.testMistakesService.remove(+id);
    if (!result) {
      throw new NotFoundException(`TestMistake with ID ${id} not found`);
    }
    return { message: 'TestMistake successfully deleted' };
  }
}
