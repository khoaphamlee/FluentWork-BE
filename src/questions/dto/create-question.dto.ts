import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOptionDto } from 'src/options/dto/create-option.dto';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
    @ApiProperty({
        description: 'The topic of the question (either Vocabulary or Grammar)',
        enum: ['Vocabulary', 'Grammar'],
    })
    @IsEnum(['Vocabulary', 'Grammar'])
    topic: 'Vocabulary' | 'Grammar';

    @ApiProperty({
        description: 'The vocabulary topic, can be IT, Business, or Finance',
        enum: ['IT', 'Business', 'Finance'],
        required: false,
    })
    @IsOptional()
    @IsEnum(['IT', 'Business', 'Finance'])
    vocabulary_topic?: 'IT' | 'Business' | 'Finance';

    @ApiProperty({
        description: 'The grammar topic, can be Tense, Passive Voice, or Conditional Sentence',
        enum: ['Tense', 'Passive Voice', 'Conditional Sentence'],
        required: false,
    })
    @IsOptional()
    @IsEnum(['Tense', 'Passive Voice', 'Conditional Sentence'])
    grammar_topic?: 'Tense' | 'Passive Voice' | 'Conditional Sentence';

    @ApiProperty({
        description: 'The level of the question (Beginner, Intermediate, or Advanced)',
        enum: ['Beginner', 'Intermediate', 'Advanced'],
    })
    @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
    level: 'Beginner' | 'Intermediate' | 'Advanced';

    @ApiProperty({
        description: 'The text of the question itself',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    question_text: string;

    @ApiProperty({
        description: "The explanation of the question's answer itself",
        type: String,
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
