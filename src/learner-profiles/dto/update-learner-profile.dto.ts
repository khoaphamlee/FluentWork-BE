import { IsEnum, IsInt, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Level } from 'src/enum/level.enum';

export class UpdateLearnerProfileDto {
  @ApiPropertyOptional({
    enum: Level,
    example: Level.INTERMEDIATE,
    description: 'Trình độ mới',
  })
  @IsOptional()
  @IsEnum(Level)
  proficiency_level?: Level;

  @ApiPropertyOptional({
    example: 10,
    description: 'Số bài học đã hoàn thành mới',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  total_lessons_completed?: number;
}
