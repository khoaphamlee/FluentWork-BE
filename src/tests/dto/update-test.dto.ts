import { IsOptional, IsNumber, IsDateString, IsString } from 'class-validator';

export class UpdateTestDto {
  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsDateString()
  test_date?: Date;

  @IsOptional()
  @IsNumber()
  total_correct_answer?: number;

  @IsOptional()
  @IsNumber()
  total_incorrect_answer?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  testTemplateId?: number;
}
