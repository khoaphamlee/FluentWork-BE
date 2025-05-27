import { IsEnum, IsInt, IsOptional, IsDateString, Min } from 'class-validator';
import { Level } from 'src/enum/level.enum';

export class CreateLearnerProfileDto {
  @IsInt()
  user_id: number;

  @IsEnum(Level)
  proficiency_level: Level;

  @IsInt()
  @Min(0)
  total_lessons_completed: number;

  @IsOptional()
  @IsDateString()
  last_activity_date?: Date;
}
