import { IsNumber, IsPositive } from 'class-validator';

export class CreateTestQuestionDto {
  @IsNumber()
  @IsPositive()
  test_id: number;

  @IsNumber()
  @IsPositive()
  question_id: number;
}
