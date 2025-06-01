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
import { LearningPathsService } from './learning-paths.service';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { LearningPath } from './entities/learning-path.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from '@nestjs/common';

@ApiTags('Learning Paths')
@ApiBearerAuth()
@Controller('learning-paths')
export class LearningPathsController {
  constructor(private readonly learningPathsService: LearningPathsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a learning path for current user' })
    @ApiResponse({ status: 201, description: 'Learning path created.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    create(
    @Body() createLearningPathDto: CreateLearningPathDto,
    @Request() req: any,
    ) {
        const userId = req.user.id;
        return this.learningPathsService.create(createLearningPathDto, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get current user’s learning path' })
    @ApiResponse({ status: 200, description: 'User learning path returned.' })
    @ApiResponse({ status: 404, description: 'Learning path not found.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    findCurrentUserPath(@Request() req: any) {
        const userId = req.user.id;
        return this.learningPathsService.findByUser(userId);
    }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin lộ trình học theo ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID của learning path' })
  @ApiResponse({ status: 200, description: 'Lộ trình học tìm thấy', type: LearningPath })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lộ trình học' })
  findOne(@Param('id') id: string) {
    return this.learningPathsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật lộ trình học' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: LearningPath })
  update(
    @Param('id') id: string,
    @Body() updateLearningPathDto: UpdateLearningPathDto,
  ) {
    return this.learningPathsService.update(+id, updateLearningPathDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lộ trình học' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  remove(@Param('id') id: string) {
    return this.learningPathsService.remove(+id);
  }
}
