import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, MaxLength } from 'class-validator';
import { Level } from 'src/enum/level.enum';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';

export class CreateLessonDto {
    @ApiPropertyOptional({ description: 'Thứ tự mặc định của bài học', example: 1 })
    @IsInt()
    @IsOptional()
    defaultOrder?: number;

    @ApiProperty({ description: 'Tiêu đề bài học', maxLength: 255, example: 'Introduction to Business English' })
    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Mô tả ngắn cho bài học', maxLength: 500, example: 'This lesson introduces basic business vocabulary and communication.' })
    @IsString()
    @MaxLength(500)
    @IsNotEmpty()
    description: string;

    @ApiProperty({ enum: Level, description: 'Trình độ của bài học', example: Level.BEGINNER })
    @IsEnum(Level)
    level: Level;

    @ApiProperty({ enum: Topic, description: 'Loại bài học', example: Topic.VOCABULARY })
    @IsEnum(Topic)
    type: Topic;

    @ApiPropertyOptional({ enum: VocabularyTopic, description: 'Chủ đề từ vựng nếu là bài từ vựng', example: VocabularyTopic.BUSINESS })
    @IsEnum(VocabularyTopic)
    @IsOptional()
    vocabulary_topic?: VocabularyTopic;

    @ApiPropertyOptional({ enum: GrammarTopic, description: 'Chủ đề ngữ pháp nếu là bài ngữ pháp', example: null })
    @IsEnum(GrammarTopic)
    @IsOptional()
    grammar_topic?: GrammarTopic;

    @ApiProperty({ description: 'Nội dung chính của bài học (HTML hoặc plain text)', example: 'This is the lesson content...' })
    @IsString()
    @IsNotEmpty()
    content: string;
}
