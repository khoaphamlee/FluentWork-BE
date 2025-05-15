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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FlashcardsService } from './flashcards.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { Flashcard } from './entities/flashcard.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/auth/roles.decorator';

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
  @ApiOperation({ summary: 'Lấy danh sách tất cả flashcard' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách flashcard.',
    type: [Flashcard],
  })
  findAll(): Promise<Flashcard[]> {
    return this.flashcardsService.findAll();
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
