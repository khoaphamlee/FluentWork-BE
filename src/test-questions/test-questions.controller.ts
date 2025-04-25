import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TestQuestionsService } from './test-questions.service';
import { CreateTestQuestionDto } from './dto/create-test-question.dto';
import { UpdateTestQuestionDto } from './dto/update-test-question.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ReturnTestQuestionDto } from './dto/return-test-question.dto';

@ApiTags('Test-questions')
@ApiBearerAuth()
@Controller('test-questions')
export class TestQuestionsController {
  constructor(private readonly testQuestionsService: TestQuestionsService) {}

  @Post()
  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Tạo câu hỏi cho bài test' })
  @ApiCreatedResponse({ type: ReturnTestQuestionDto, description: 'Tạo test question thành công' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không có quyền tạo' })
  create(@Body() createTestQuestionDto: CreateTestQuestionDto) {
    return this.testQuestionsService.create(createTestQuestionDto);
  }

  @Get()
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách test questions' })
  @ApiOkResponse({ type: [ReturnTestQuestionDto], description: 'Danh sách test question' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  findAll() {
    return this.testQuestionsService.findAll();
  }

  @Get(':id')
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy test question theo ID' })
  @ApiOkResponse({ type: ReturnTestQuestionDto, description: 'Thông tin test question' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy test question' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.testQuestionsService.findOne(+id);
  }

  @Patch(':id')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Cập nhật test question' })
  @ApiOkResponse({ type: ReturnTestQuestionDto, description: 'Cập nhật thành công' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không có quyền cập nhật' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy test question' })
  update(@Param('id') id: string, @Body() updateTestQuestionDto: UpdateTestQuestionDto) {
    return this.testQuestionsService.update(+id, updateTestQuestionDto);
  }

  @Delete(':id')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Xoá test question' })
  @ApiOkResponse({ description: 'Xoá thành công' })
  @ApiUnauthorizedResponse({ description: 'Chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Không có quyền xoá' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy test question' })
  remove(@Param('id') id: string) {
    return this.testQuestionsService.remove(+id);
  }
}
