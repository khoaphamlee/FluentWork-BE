import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { LessonProgressesService } from './lesson-progresses.service';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@ApiTags('Lesson Progresses')
@ApiBearerAuth()
//@UseGuards(JwtAuthGuard, RolesGuard) // phân role
@Controller('lesson-progresses')
export class LessonProgressesController {
  constructor(
    private readonly lessonProgressesService: LessonProgressesService,
  ) {}

  @ApiOperation({ summary: 'Learner bắt đầu/chốt tiến độ bài học' })
  @Post()
  //@Roles(UserRole.Admin, UserRole.Learner)
  create(@Req() req, @Body() createLessonProgressDto: CreateLessonProgressDto) {
    const payload = {
      ...createLessonProgressDto,
      userId: req.user.id,
    };

    return this.lessonProgressesService.create(payload);
  }

  @ApiOperation({ summary: 'Liệt kê tiến độ (lọc tuỳ chọn)' })
  @Get()
  //@Roles(UserRole.Admin, UserRole.Instructor, UserRole.Learner)
  findAll(
    @Req() req,
    @Query('userId') userId?: number,
    @Query('lessonId') lessonId?: number,
    @Query('status') status?: 'Not Started' | 'In Progress' | 'Completed',
  ) {
    const effectiveUserId =
      req.user.role === UserRole.Learner ? req.user.id : userId;

    return this.lessonProgressesService.findAll({
      userId: effectiveUserId,
      lessonId,
      status,
    });
  }

  @ApiOperation({ summary: 'Xem chi tiết một tiến độ' })
  @Get(':id')
  //@Roles(UserRole.Admin, UserRole.Instructor, UserRole.Learner)
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.lessonProgressesService.findOne(id, req.user);
  }
  @ApiOperation({ summary: 'Cập nhật tiến độ' })
  @Patch(':id')
  //@Roles(UserRole.Admin, UserRole.Learner)
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonProgressDto: UpdateLessonProgressDto,
  ) {
    return this.lessonProgressesService.update(
      id,
      updateLessonProgressDto,
      req.user,
    );
  }

  @ApiOperation({ summary: 'Xoá tiến độ (nếu cần rollback)' })
  @Delete(':id')
  // @Roles(UserRole.Admin)
  remove(@Param('id') id: string) {
    return this.lessonProgressesService.remove(+id);
  }
}
