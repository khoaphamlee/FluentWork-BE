export class CreateTestDto {
    user_id: number;
    score: number;
    proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    test_date: Date;
}
  