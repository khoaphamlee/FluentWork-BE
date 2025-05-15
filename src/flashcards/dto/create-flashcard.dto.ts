import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

export class CreateFlashcardDto {
  @ApiProperty()
  @IsEnum(VocabularyTopic)
  topic: VocabularyTopic;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  word: string;

  @ApiProperty()
  @IsString()
  definition: string;
}
