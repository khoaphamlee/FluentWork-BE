import { IsNotEmpty, IsNumber, IsBoolean, IsString, IsInt } from 'class-validator';

export class CreateTestAnswerDto {
  @IsNumber()
  @IsInt()
  test_question_id: number;

  @IsNumber()
  @IsInt()
  option_id: number;

  @IsBoolean()
  is_correct: boolean;
}
