import { IsEnum, IsNotEmpty, IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class CreateTestDto {
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  score: number;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';

  @IsString()
  duration: string;

  @IsDate()
  test_date: Date;
}
