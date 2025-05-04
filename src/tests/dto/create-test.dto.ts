import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsArray, IsString, IsDate } from "class-validator";

export class CreateTestDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;
  
    @IsEnum(['Beginner' , 'Intermediate' , 'Advanced'])
    level: 'Beginner' | 'Intermediate' | 'Advanced';
  
    @IsEnum(['Vocabulary' , 'Grammar' , 'Mixed'])
    topic: 'Vocabulary' | 'Grammar' | 'Mixed';
  
    @IsOptional()
    @IsArray()
    @IsEnum(['IT', 'Business', 'Finance'], { each: true })
    vocabulary_topic?: ('IT' | 'Business' | 'Finance')[];
  
    @IsOptional()
    @IsArray()
    @IsEnum(['Tense', 'Passive Voice', 'Conditional Sentence'], { each: true })
    grammar_topic?: ('Tense' | 'Passive Voice' | 'Conditional Sentence')[];
  
    @IsNotEmpty()
    @IsString()
    duration: string;
  
    @Type(() => Date)
    @IsDate()
    test_date: Date;
  
    @IsOptional()
    @IsNumber()
    total_correct_answers: number = 0;
  
    @IsOptional()
    @IsNumber()
    total_incorrect_answers: number = 0;
  
    @IsOptional()
    @IsNumber()
    testTemplateId: number;
  }
  