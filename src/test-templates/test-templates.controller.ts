import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TestTemplatesService } from './test-templates.service';
import { CreateTestTemplateDto } from './dto/create-test-template.dto';
import { UpdateTestTemplateDto } from './dto/update-test-template.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReturnTestTemplateDto } from './dto/return-test-template.dto';

@ApiTags('Test Templates')
@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
@Controller('test-templates')
export class TestTemplatesController {
  constructor(private readonly testTemplatesService: TestTemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mẫu đề thi mới' })
  @ApiCreatedResponse({
    type: ReturnTestTemplateDto,
    description: 'Tạo mẫu đề thi thành công',
  })
  create(@Body() createTestTemplateDto: CreateTestTemplateDto) {
    return this.testTemplatesService.create(createTestTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả mẫu đề thi' })
  @ApiOkResponse({
    type: [ReturnTestTemplateDto],
    description: 'Danh sách mẫu đề thi',
  })
  findAll() {
    return this.testTemplatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin một mẫu đề thi' })
  @ApiOkResponse({
    type: ReturnTestTemplateDto,
    description: 'Thông tin chi tiết mẫu đề thi',
  })
  findOne(@Param('id') id: string) {
    return this.testTemplatesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật mẫu đề thi' })
  @ApiOkResponse({
    type: ReturnTestTemplateDto,
    description: 'Mẫu đề thi sau khi cập nhật',
  })
  update(
    @Param('id') id: string,
    @Body() updateTestTemplateDto: UpdateTestTemplateDto,
  ) {
    return this.testTemplatesService.update(+id, updateTestTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá mẫu đề thi' })
  @ApiOkResponse({ description: 'Xoá mẫu đề thi thành công' })
  remove(@Param('id') id: string) {
    return this.testTemplatesService.remove(+id);
  }
}
