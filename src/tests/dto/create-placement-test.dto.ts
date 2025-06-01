import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsString,
  IsDate,
} from 'class-validator';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlacementTestDto {
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
