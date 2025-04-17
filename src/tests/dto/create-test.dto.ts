import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export enum ProficiencyLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export class CreateTestDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  score: number = 0;

  @IsOptional()
  @IsEnum(ProficiencyLevel)
  proficiency_level: ProficiencyLevel;

  @IsString()
  duration: string;

  @Type(() => Date)
  @IsDate()
  test_date: Date;

  @IsOptional()
  @IsNumber()
  total_correct_answers: number = 0;

  @IsNotEmpty()
  @IsNumber()
  testTemplateId: number;
}
