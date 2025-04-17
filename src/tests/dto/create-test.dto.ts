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
  user_id: number; 

  @IsNumber()
  score: number; 

  @IsEnum(ProficiencyLevel) 
  proficiency_level: ProficiencyLevel; 

  @IsString()
  duration: string;  

  @Type(() => Date)
  @IsDate()
  test_date: Date;

  @IsNumber()
  total_correct_answers: number;
}
