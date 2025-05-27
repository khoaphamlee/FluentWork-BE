import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import {
  DateCountDto,
  RoleDistributionDto,
  SummaryDto,
} from './dto/dashboard.dto';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Dashboard')
//@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Roles('Admin')
  @ApiOperation({ summary: 'Thống kê tổng lesson, question, flashcard, user' })
  @ApiResponse({
    status: 200,
    type: SummaryDto,
    description: 'Tổng số liệu thống kê hệ thống.',
  })
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('learners-daily')
  @Roles('Admin', 'Instructor')
  @ApiOperation({
    summary: 'Thống kê số lượng Learner theo ngày tạo tài khoản',
  })
  @ApiResponse({ status: 200, type: [DateCountDto] })
  getLearnersDaily(): Promise<DateCountDto[]> {
    return this.dashboardService.getLearnersPerDay();
  }

  @Get('user-role-distribution')
  @Roles('Admin')
  @ApiOperation({ summary: 'Tỷ lệ phần trăm số lượng user theo vai trò' })
  @ApiResponse({ status: 200, type: [RoleDistributionDto] })
  getUserRoleDistribution(): Promise<RoleDistributionDto[]> {
    return this.dashboardService.getUserRoleDistribution();
  }

  //   @Get('profile-summary')
  // @Roles('Learner')
  // @ApiOperation({ summary: 'Tóm tắt hồ sơ người học' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Thông tin hồ sơ người học',
  //   schema: {
  //     example: {
  //       fullName: 'Nguyen Van A',
  //       email: 'a@gmail.com',
  //       currentLevel: 'Intermediate',
  //       registrationDate: '2025-05-01',
  //       lessonsStarted: 12,
  //       lessonsCompleted: 9,
  //     },
  //   },
  // })
  // // getProfileSummary(@CurrentUser() user: User) {
  // //   return this.dashboardService.getLearnerProfileSummary(user.id);
  // // }
}
