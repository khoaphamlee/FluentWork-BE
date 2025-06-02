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
import { LearnerProfilesService } from './learner-profiles.service';
import { CreateLearnerProfileDto } from './dto/create-learner-profile.dto';
import { UpdateLearnerProfileDto } from './dto/update-learner-profile.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Request } from '@nestjs/common';

@ApiTags('Learner Profiles')
@ApiBearerAuth()
@Controller('learner-profiles')
export class LearnerProfilesController {
  constructor(
    private readonly learnerProfilesService: LearnerProfilesService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Learner xem hồ sơ cá nhân của mình' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin hồ sơ của Learner hiện tại',
    schema: {
      example: {
        id: 1,
        user: {
          id: 142,
          username: 'learner',
          email: 'learner@example.com',
          full_name: 'Learner',
          role: 'Learner',
        },
        level: 'Intermediate',
        total_lessons_completed: 5,
        created_at: '2025-05-29T06:14:26.266Z',
        updated_at: '2025-05-29T06:14:26.266Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'LearnerProfile not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'LearnerProfile not found',
        error: 'Not Found',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  getCurrentLearnerProfile(@Request() req) {
    return this.learnerProfilesService.findByUserId(req.user.id);
  }

  @Post()
  @Roles('Learner')
  @ApiOperation({ summary: 'Learner tạo hồ sơ cá nhân' })
  @ApiResponse({
    status: 201,
    description: 'LearnerProfile created successfully',
    schema: {
      example: {
        id: 1,
        user: { id: 1, username: 'learner', email: 'learner@example.com' },
        level: 'Intermediate',
        total_lessons_completed: 5,
        created_at: '2025-05-29T06:14:26.266Z',
        updated_at: '2025-05-29T06:14:26.266Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'LearnerProfile for this user already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'LearnerProfile for this user already exists',
        error: 'Conflict',
      },
    },
  })
  create(@Body() dto: CreateLearnerProfileDto) {
    return this.learnerProfilesService.create(dto);
  }

  @Get()
  @Roles('Admin')
  @ApiOperation({ summary: 'Admin xem tất cả hồ sơ người học' })
  @ApiResponse({
    status: 200,
    description: 'Fetch all learner profiles',
    schema: {
      example: [
        {
          id: 1,
          user: {
            id: 142,
            username: 'learner',
            email: 'learner@example.com',
            full_name: 'Learner',
            role: 'Learner',
          },
          level: 'Intermediate',
          total_lessons_completed: 5,
          created_at: '2025-05-29T06:14:26.266Z',
          updated_at: '2025-05-29T06:14:26.266Z',
        },
      ],
    },
  })
  findAll() {
    return this.learnerProfilesService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Learner')
  @ApiOperation({ summary: 'Xem chi tiết hồ sơ người học' })
  @ApiResponse({
    status: 200,
    description: 'LearnerProfile details',
    schema: {
      example: {
        id: 1,
        user: {
          id: 142,
          username: 'learner',
          email: 'learner@example.com',
          full_name: 'Learner',
          role: 'Learner',
        },
        level: 'Intermediate',
        total_lessons_completed: 5,
        created_at: '2025-05-29T06:14:26.266Z',
        updated_at: '2025-05-29T06:14:26.266Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'LearnerProfile not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'LearnerProfile not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.learnerProfilesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Learner')
  @ApiOperation({ summary: 'Learner cập nhật tiến độ của mình' })
  @ApiResponse({
    status: 200,
    description: 'LearnerProfile updated successfully',
    schema: {
      example: {
        id: 1,
        level: 'Advanced',
        total_lessons_completed: 10,
        updated_at: '2025-05-29T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'LearnerProfile not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'LearnerProfile not found',
        error: 'Not Found',
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateLearnerProfileDto) {
    return this.learnerProfilesService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Admin xóa hồ sơ người học' })
  @ApiResponse({
    status: 200,
    description: 'LearnerProfile deleted successfully',
    schema: {
      example: {
        message: 'LearnerProfile deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'LearnerProfile not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'LearnerProfile not found',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.learnerProfilesService.remove(+id);
  }
}
