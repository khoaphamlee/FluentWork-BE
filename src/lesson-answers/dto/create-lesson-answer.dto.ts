import { IsInt, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateLessonAnswerDto {
  @IsInt()
  @IsNotEmpty()
  lesson_question_id: number;

  @IsInt()
  @IsNotEmpty()
  option_id: number;

  @IsBoolean()
  @IsNotEmpty()
  is_correct: boolean;
}
