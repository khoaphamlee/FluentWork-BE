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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FlashcardsService } from './flashcards.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { Flashcard } from './entities/flashcard.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

@ApiTags('Flashcards')
@ApiBearerAuth() // Cho biết các API yêu cầu Bearer token
@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Instructor)
  @ApiOperation({ summary: 'Tạo flashcard mới' })
  @ApiResponse({
    status: 201,
    description: 'Flashcard đã được tạo thành công.',
    type: Flashcard,
  })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo flashcard.' })
  create(@Body() createFlashcardDto: CreateFlashcardDto) {
    return this.flashcardsService.create(createFlashcardDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tìm kiếm danh sách flashcard theo từ khóa' })
  @ApiQuery({
    name: 'topic',
    enum: VocabularyTopic,
    required: false,
    description: 'Chủ đề từ vựng',
  })
  @ApiQuery({
    name: 'word',
    required: false,
    description: 'Từ cần tìm kiếm (tìm kiếm chính xác hoặc gần đúng)',
  })
  @ApiQuery({
    name: 'definition',
    required: false,
    description: 'Định nghĩa chứa từ khóa (full-text search)',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách flashcard tìm được.',
    type: [Flashcard],
  })
  findAll(
    @Query('topic') topic?: VocabularyTopic,
    @Query('word') word?: string,
    @Query('definition') definition?: string,
  ): Promise<Flashcard[]> {
    return this.flashcardsService.findAll({ topic, word, definition });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin chi tiết của một flashcard' })
  @ApiResponse({
    status: 200,
    description: 'Flashcard tìm thấy.',
    type: Flashcard,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy flashcard.' })
  findOne(@Request() req, @Param('id') id: string) {
    const requestedId = +id;
    return this.flashcardsService.findOne(requestedId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Instructor)
  @ApiOperation({ summary: 'Cập nhật thông tin flashcard' })
  @ApiResponse({
    status: 200,
    description: 'Flashcard đã được cập nhật.',
    type: Flashcard,
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền cập nhật flashcard.',
  })
  update(
    @Param('id') id: string,
    @Body() updateFlashcardDto: UpdateFlashcardDto,
  ) {
    return this.flashcardsService.update(+id, updateFlashcardDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Instructor)
  @ApiOperation({ summary: 'Xóa một flashcard' })
  @ApiResponse({ status: 200, description: 'Flashcard đã được xóa.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa flashcard.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy flashcard.' })
  remove(@Param('id') id: string) {
    return this.flashcardsService.remove(+id);
  }
}
