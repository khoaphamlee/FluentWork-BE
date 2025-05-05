import { PartialType } from '@nestjs/mapped-types';
import { CreateFlashcardDto } from './create-flashcard.dto';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

export class UpdateFlashcardDto {
  @IsOptional()
  @IsEnum(VocabularyTopic)
  topic?: VocabularyTopic;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  word?: string;

  @IsOptional()
  @IsString()
  definition?: string;
}
