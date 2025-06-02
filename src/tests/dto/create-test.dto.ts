import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsString,
  IsDate,
  Validate,
} from 'class-validator';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestTopicValidator } from 'src/validator/test_topic.validator';

export class CreateTestDto {
  @ApiProperty({ enum: ['Beginner', 'Intermediate', 'Advanced', 'All'] })
  @IsEnum(['Beginner', 'Intermediate', 'Advanced', 'All'])
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';

  @ApiProperty({ enum: ['Vocabulary', 'Grammar', 'Mixed'], example: 'Vocabulary' })
  @IsEnum(['Vocabulary', 'Grammar', 'Mixed'])
  type: 'Vocabulary' | 'Grammar' | 'Mixed';

  @ApiPropertyOptional({
    enum: VocabularyTopic,
    isArray: true,
    example: ['Business'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(VocabularyTopic, { each: true })
  vocabulary_topic?: VocabularyTopic[] | null;

  @ApiPropertyOptional({
    enum: GrammarTopic,
    isArray: true,
    example: [],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(GrammarTopic, { each: true })
  grammar_topic?: GrammarTopic[] | null;

  @ApiProperty({ example: '15m' })
  @IsNotEmpty()
  @IsString()
  duration: string;

  @ApiProperty({ example: '2025-05-17T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  test_date: Date;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  total_correct_answers: number = 0;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  total_incorrect_answers: number = 0;
}
