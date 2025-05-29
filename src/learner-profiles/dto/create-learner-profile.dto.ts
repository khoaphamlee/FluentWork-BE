import { IsEnum, IsInt, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Level } from 'src/enum/level.enum';

export class CreateLearnerProfileDto {
  @ApiProperty({ example: 1, description: 'ID của user tạo profile' })
  @IsInt()
  user_id: number;

  @ApiProperty({
    enum: Level,
    example: Level.BEGINNER,
    description: 'Trình độ ban đầu',
  })
  @IsEnum(Level)
  proficiency_level: Level;

  @ApiProperty({ example: 0, description: 'Tổng số bài học đã hoàn thành' })
  @IsInt()
  @Min(0)
  total_lessons_completed: number;
}
