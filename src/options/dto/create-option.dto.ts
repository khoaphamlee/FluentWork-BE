export class CreateOptionDto {
    questionId: number;
    option_text: string;
    is_correct: boolean;
    explanation?: string;
}
  