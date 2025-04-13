export class CreateExerciseAttemptDto {
    user_id: number;
    question_id: number;
    selected_option_id: number;
    is_correct: boolean;
    answered_at: Date;
  }
  