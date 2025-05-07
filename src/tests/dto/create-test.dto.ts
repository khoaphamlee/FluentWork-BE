import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsArray, IsString, IsDate } from "class-validator";
import { GrammarTopic } from "src/enum/grammar-topic.enum";
import { VocabularyTopic } from "src/enum/vocabulary-topic.enum";



export class CreateTestDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced', 'All'])
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';

  @IsEnum(['Vocabulary', 'Grammar', 'Mixed'])
  type: 'Vocabulary' | 'Grammar' | 'Mixed';

  @IsOptional()
  @IsArray()
  @IsEnum(VocabularyTopic, { each: true })  // Use the enum
  vocabulary_topic?: VocabularyTopic[];

  @IsOptional()
  @IsArray()
  @IsEnum(GrammarTopic, { each: true })      // Use the enum
  grammar_topic?: GrammarTopic[];

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