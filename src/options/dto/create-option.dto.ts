import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOptionDto {
//   @IsNumber()
//   question_id: number;  

  @IsString()
  @MaxLength(255)
  option_text: string;  

  @IsBoolean()
  is_correct: boolean; 
}
