import { ApiProperty } from '@nestjs/swagger';
import { Level } from 'src/enum/level.enum';
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
    example: ['TENSES', 'BUSINESS'], // ví dụ các topic thuộc GrammarTopic và VocabularyTopic
    description: 'List of grammar or vocabulary topics',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  topics: string[];
}
