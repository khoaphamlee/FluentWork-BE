import {
    IsInt,
    IsArray,
    IsString,
    IsPositive,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';
  
export class CreateTestQuestionDto {
    @IsNumber()
    @IsPositive()
    test_template_id: number;
  
    @IsString()
    @IsNotEmpty()
    question_text: string;
  
    @IsArray()
    @IsString({ each: true })
    options: string[];
  
    @IsInt()
    correct_answer_index: number;
}
  