import { PartialType } from '@nestjs/mapped-types';
import { CreateTestTemplateDto } from './create-test-template.dto';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, ArrayNotEmpty } from 'class-validator';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

export class ReturnTestTemplateDto {
    id: number;
    title: string;
    description?: string;
    type: 'Vocabulary' | 'Grammar' | 'Mixed';
    vocabulary_topic?: VocabularyTopic[] | null;
    grammar_topic?: GrammarTopic[] | null;
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
    is_active?: boolean;
    created_at: Date;
    updated_at: Date;
}