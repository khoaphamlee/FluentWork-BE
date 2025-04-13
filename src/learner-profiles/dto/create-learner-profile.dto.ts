export class CreateLearnerProfileDto {
    user_id: number;
    proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';
    total_lessons_completed: number;
    last_activity_date?: Date;
  }
  