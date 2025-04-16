import { IsInt, IsBoolean, IsDateString } from 'class-validator';

export class CreateExerciseAttemptDto {
  @IsInt()
  user_id: number;

  @IsInt()
  question_id: number;

  @IsInt()
  selected_option_id: number;

  @IsBoolean()
  is_correct: boolean;

  @IsDateString()
  answered_at: Date;
}
