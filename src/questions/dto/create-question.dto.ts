export class CreateQuestionDto {
    topic: 'Vocabulary' | 'Grammar';
    category?: 'IT' | 'Business' | 'Finance'; // optional nếu topic là Vocabulary
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    question_text: string;
}
  