import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonProgressDto } from './create-lesson-progress.dto';
import { IsDate, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateLessonProgressDto {
  @IsEnum(['Not Started', 'In Progress', 'Completed'])
  @IsOptional()
  status?: 'Not Started' | 'In Progress' | 'Completed';

  @IsOptional()
  @IsInt()
  @Min(0)
  total_correct_answers?: number;

  @IsOptional()
  @IsDate()
  started_at?: Date;

  @IsOptional()
  @IsDate()
  completed_at?: Date;
}
