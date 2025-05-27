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

@ApiTags('Learner Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('learner-profiles')
export class LearnerProfilesController {
  constructor(
    private readonly learnerProfilesService: LearnerProfilesService,
  ) {}

  @Post()
  @Roles('Learner')
  @ApiOperation({ summary: 'Learner tạo hồ sơ cá nhân' })
  create(@Body() dto: CreateLearnerProfileDto) {
    return this.learnerProfilesService.create(dto);
  }

  @Get()
  @Roles('Admin')
  @ApiOperation({ summary: 'Admin xem tất cả hồ sơ người học' })
  findAll() {
    return this.learnerProfilesService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Learner')
  @ApiOperation({ summary: 'Xem chi tiết hồ sơ người học' })
  findOne(@Param('id') id: string) {
    return this.learnerProfilesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Learner')
  @ApiOperation({ summary: 'Learner cập nhật tiến độ của mình' })
  update(@Param('id') id: string, @Body() dto: UpdateLearnerProfileDto) {
    return this.learnerProfilesService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Admin xóa hồ sơ người học' })
  remove(@Param('id') id: string) {
    return this.learnerProfilesService.remove(+id);
  }
}
