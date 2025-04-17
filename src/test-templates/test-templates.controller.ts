import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestTemplatesService } from './test-templates.service';
import { CreateTestTemplateDto } from './dto/create-test-template.dto';
import { UpdateTestTemplateDto } from './dto/update-test-template.dto';

@Controller('test-templates')
export class TestTemplatesController {
  constructor(private readonly testTemplatesService: TestTemplatesService) {}

  @Post()
  create(@Body() createTestTemplateDto: CreateTestTemplateDto) {
    return this.testTemplatesService.create(createTestTemplateDto);
  }

  @Get()
  findAll() {
    return this.testTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testTemplatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestTemplateDto: UpdateTestTemplateDto) {
    return this.testTemplatesService.update(+id, updateTestTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testTemplatesService.remove(+id);
  }
}
