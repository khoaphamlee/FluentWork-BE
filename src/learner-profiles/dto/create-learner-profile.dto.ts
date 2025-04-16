import {
  IsEnum,
  IsInt,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateLearnerProfileDto {
  @IsInt()
  user_id: number;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';

  @IsInt()
  @Min(0)
  total_lessons_completed: number;

  @IsOptional()
  @IsDateString()
  last_activity_date?: Date;
}
