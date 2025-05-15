import { PartialType } from '@nestjs/mapped-types';
import { CreateFlashcardDto } from './create-flashcard.dto';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFlashcardDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(VocabularyTopic)
  topic?: VocabularyTopic;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  word?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  definition?: string;
}
