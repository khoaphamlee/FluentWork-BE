export class CreateLearningPathDto {
    userId: number;
    proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';
    category?: 'IT' | 'Business' | 'Finance' | 'Healthcare' | 'Hospitality' | 'Other';
    lessonIds: number[];
}
  