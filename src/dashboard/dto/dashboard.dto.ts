import { ApiProperty } from '@nestjs/swagger';

export class DateCountDto {
  @ApiProperty({ example: '2025-05-01' })
  date: string; // ISO date string

  @ApiProperty({ example: 10 })
  count: number;
}

export class RoleDistributionDto {
  @ApiProperty({ example: 'Learner' })
  role: string;

  @ApiProperty({ example: 75.5 })
  count: number; // percentage
}

export class SummaryDto {
  @ApiProperty({ example: 100 })
  totalUsers: number;

  @ApiProperty({ example: 25 })
  totalLessons: number;

  @ApiProperty({ example: 200 })
  totalQuestions: number;

  @ApiProperty({ example: 10 })
  totalFlashcards: number;
}
