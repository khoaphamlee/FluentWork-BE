import { ApiProperty } from '@nestjs/swagger';
import { Level } from 'src/enum/level.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { ArrayNotEmpty, IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateLearningPathDto {
  @ApiProperty({ enum: Level, example: Level.BEGINNER })
  @IsEnum(Level)
  level: Level;

  @ApiProperty({ example: 'Beginner - Business and Grammar' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A custom path for beginner learners interested in Business and Grammar topics',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: [VocabularyTopic.BUSINESS],
    description: 'List of vocabulary topics selected by the user',
    enum: VocabularyTopic,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(VocabularyTopic, { each: true })
  vocabularyTopics: VocabularyTopic[];
}
