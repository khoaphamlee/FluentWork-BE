import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  import { CreateOptionDto } from 'src/options/dto/create-option.dto';
  import { Type } from 'class-transformer';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { Level } from 'src/enum/level.enum';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
  
export class CreateQuestionDto {
    @ApiProperty({
      description: 'The topic of the question (either Vocabulary or Grammar)',
      enum: Topic,
    })
    @IsEnum(Topic)
    topic: Topic;
  
    @ApiProperty({
      description: 'The vocabulary topic',
      enum: VocabularyTopic,
      required: false,
    })
    @IsOptional()
    @IsEnum(VocabularyTopic)
    vocabulary_topic?: VocabularyTopic;
  
    @ApiProperty({
      description: 'The grammar topic',
      enum: GrammarTopic,
      required: false,
    })
    @IsOptional()
    @IsEnum(GrammarTopic)
    grammar_topic?: GrammarTopic;
  
    @ApiProperty({
      description: 'The level of the question (Beginner, Intermediate, or Advanced)',
      enum: Level,
    })
    @IsEnum(Level)
    level: Level;
  
    @ApiProperty({
      description: 'The text of the question itself',
      type: String,
    })
    @IsString()
    @IsNotEmpty()
    question_text: string;
  
    @ApiProperty({
      description: "The explanation of the question's answer",
      type: String,
      required: false,
    })
    @IsOptional()
    @IsString()
    explanation?: string;
  
    @ApiProperty({ type: [CreateOptionDto], description: 'List of 4 options' })
    @IsArray()
    @ArrayMinSize(4)
    @ArrayMaxSize(4)
    @ValidateNested({ each: true })
    @Type(() => CreateOptionDto)
    options: CreateOptionDto[];
}
  