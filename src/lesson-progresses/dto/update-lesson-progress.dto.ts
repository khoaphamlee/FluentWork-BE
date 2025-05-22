import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLessonProgressDto {
  @IsOptional()
  @IsEnum(['Not Started', 'In Progress', 'Completed'])
  @ApiPropertyOptional({ enum: ['Not Started', 'In Progress', 'Completed'] })
  status?: 'Not Started' | 'In Progress' | 'Completed';

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Tổng số câu đúng' })
  total_correct_answers?: number;
}
