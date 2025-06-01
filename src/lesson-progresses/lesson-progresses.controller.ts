import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  Request,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';

import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';
import { Roles } from 'src/auth/roles.decorator';

import { UserRole } from '../common/enums/user-role.enum';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { LessonProgressService } from './lesson-progresses.service';

@ApiTags('Lesson Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lesson-progress')
export class LessonProgressController {
  constructor(private readonly service: LessonProgressService) {}

  @Post()
  @Roles(UserRole.Learner)
  @ApiOperation({ summary: 'Learner starts a lesson' })
  @ApiResponse({
    status: 201,
    description: 'Lesson progress started successfully',
    schema: {
      example: {
        message: ['Lesson progress started successfully'],
        data: {
          id: 1,
          status: 'In Progress',
          total_correct_answers: 0,
          started_at: '2025-05-23T09:00:00+07:00',
          completed_at: null,
          lesson: { id: 1, title: 'Finance Vocabulary Basics' },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User or Lesson not found',
    schema: {
      example: {
        message: ['User or Lesson not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async create(@Request() req, @Body() dto: CreateLessonProgressDto) {
    return this.service.create(req.user.id, dto.lessonId);
  }

  @Get()
  @Roles(UserRole.Learner)
  @ApiOperation({ summary: 'Get all progress records for current learner' })
  @ApiResponse({
    status: 200,
    description: 'List of learner progress',
    schema: {
      example: {
        message: ['Lesson progress retrieved successfully'],
        data: [
          {
            id: 1,
            status: 'In Progress',
            total_correct_answers: 2,
            started_at: '2025-05-23T09:00:00+07:00',
            completed_at: null,
            lesson: { id: 1, title: 'Finance Vocabulary Basics' },
          },
        ],
      },
    },
  })
  async findAll(@Request() req) {
    return this.service.findByUser(req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.Learner)
  @ApiOperation({
    summary: 'Update lesson progress (status, correct answers, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress updated successfully',
    schema: {
      example: {
        message: ['Lesson progress updated successfully'],
        data: {
          id: 1,
          status: 'Completed',
          total_correct_answers: 5,
          started_at: '2025-05-23T09:00:00+07:00',
          completed_at: '2025-05-23T09:15:00+07:00',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Progress not found',
    schema: {
      example: {
        message: ['Progress not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async update(@Param('id') id: string, @Body() dto: UpdateLessonProgressDto) {
    return this.service.update(+id, dto);
  }

  @Get(':lessonId')
  @Roles(UserRole.Learner)
  @ApiOperation({
    summary: 'Get progress of current learner for a specific lesson',
  })
  @ApiResponse({
    status: 200,
    description: 'Single lesson progress retrieved',
    schema: {
      example: {
        message: ['Lesson progress retrieved'],
        data: {
          id: 1,
          status: 'In Progress',
          total_correct_answers: 0,
          started_at: '2025-05-23T09:00:00+07:00',
          completed_at: null,
          lesson: { id: 1, title: 'Finance Vocabulary Basics' },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Progress not found',
    schema: {
      example: {
        message: ['Progress not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async getProgressByLesson(
    @Request() req,
    @Param('lessonId') lessonId: number,
  ) {
    return this.service.findByUserAndLesson(req.user.id, lessonId);
  }
}

