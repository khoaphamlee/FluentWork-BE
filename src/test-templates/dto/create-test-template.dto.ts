import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, ArrayNotEmpty } from 'class-validator';

export class CreateTestTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['Vocabulary', 'Grammar', 'Mixed'])
  topic: 'Vocabulary' | 'Grammar' | 'Mixed'; 

  @ValidateIf((o) => o.topic === 'Vocabulary' || o.topic === 'Mixed')
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(['IT', 'Business', 'Finance'], { each: true })
  @IsOptional()  
  vocabulary_topic?: ('IT' | 'Business' | 'Finance')[];

  @ValidateIf((o) => o.topic === 'Grammar' || o.topic === 'Mixed')
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(['Tense', 'Passive Voice', 'Conditional Sentence'], { each: true })
  @IsOptional()  
  grammar_topic?: ('Tense' | 'Passive Voice' | 'Conditional Sentence')[];

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  @IsOptional()  
  level?: 'Beginner' | 'Intermediate' | 'Advanced';

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
