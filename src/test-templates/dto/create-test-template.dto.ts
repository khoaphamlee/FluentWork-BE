import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, ArrayNotEmpty } from 'class-validator';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';


export class CreateTestTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['Vocabulary', 'Grammar', 'Mixed'])
  type: 'Vocabulary' | 'Grammar' | 'Mixed';

  @ValidateIf((o) => o.topic === 'Vocabulary' || o.topic === 'Mixed')
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(VocabularyTopic, { each: true })
  @IsOptional()
  vocabulary_topic?: VocabularyTopic[];

  @ValidateIf((o) => o.topic === 'Grammar' || o.topic === 'Mixed')
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(GrammarTopic, { each: true })
  @IsOptional()
  grammar_topic?: GrammarTopic[];

  @IsEnum(['Beginner', 'Intermediate', 'Advanced', 'All'])
  @IsOptional()
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}