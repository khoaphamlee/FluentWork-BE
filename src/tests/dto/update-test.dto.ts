import { PartialType } from '@nestjs/mapped-types';
import { CreateTestDto, ProficiencyLevel } from './create-test.dto';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsEnum, IsString, IsDate } from 'class-validator';

export class UpdateTestDto {
    @IsOptional()
    @IsNumber()
    user_id?: number;
  
    @IsOptional()
    @IsNumber()
    score?: number;
  
    @IsOptional()
    @IsEnum(ProficiencyLevel)
    proficiency_level?: ProficiencyLevel;
  
    @IsOptional()
    @IsString()
    duration?: string;
  
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    test_date?: Date;
  
    @IsOptional()
    @IsNumber()
    total_correct_answers?: number;
  
    @IsOptional()
    @IsNumber()
    testTemplateId?: number;
}
  
