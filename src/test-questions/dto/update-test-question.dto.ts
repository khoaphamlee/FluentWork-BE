import { PartialType } from '@nestjs/mapped-types';
import { CreateTestQuestionDto } from './create-test-question.dto';
import { IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateTestQuestionDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    question_id?: number;
  
    @IsOptional()
    @IsNumber()
    @IsPositive()
    test_template_id?: number;
}
