import { IsNotEmpty, IsNumber, IsBoolean, IsString, IsInt } from 'class-validator';

export class CreateTestAnswerDto {
  @IsNumber()
  @IsInt()
  test_question_id: number;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsBoolean()
  is_correct: boolean;
}
