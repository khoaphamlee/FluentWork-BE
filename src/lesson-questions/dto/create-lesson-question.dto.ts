import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLessonQuestionDto {
  @IsInt()
  @IsNotEmpty()
  lesson_id: number;

  @IsInt()
  @IsNotEmpty()
  question_id: number;
}
