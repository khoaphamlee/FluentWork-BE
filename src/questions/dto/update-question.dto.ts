import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { Level } from 'src/enum/level.enum';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { Type } from 'class-transformer';
import { UpdateOptionDto } from 'src/options/dto/update-option.dto';

export class UpdateQuestionDto {
  @ApiProperty({ enum: Topic, required: false })
  @IsOptional()
  @IsEnum(Topic)
  type?: Topic;

  @ApiProperty({ enum: VocabularyTopic, required: false })
  @IsOptional()
  @IsEnum(VocabularyTopic)
  vocabulary_topic?: VocabularyTopic;

  @ApiProperty({ enum: GrammarTopic, required: false })
  @IsOptional()
  @IsEnum(GrammarTopic)
  grammar_topic?: GrammarTopic;

  @ApiProperty({ enum: Level, required: false })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  question_text?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({ type: [UpdateOptionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOptionDto)
  options?: UpdateOptionDto[];
}
