import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, MaxLength } from 'class-validator';
import { Level } from 'src/enum/level.enum';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';

export class CreateLessonDto {
  @IsInt()
  @IsOptional()
  defaultOrder?: number;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  description: string;

  @IsEnum(Level)
  level: Level;

  @IsEnum(Topic)
  type: Topic;

  @IsEnum(VocabularyTopic)
  @IsOptional()
  vocabulary_topic?: VocabularyTopic;

  @IsEnum(GrammarTopic)
  @IsOptional()
  grammar_topic?: GrammarTopic;

  @IsString()
  @IsNotEmpty()
  content: string;
}
