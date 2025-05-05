import { IsEnum, IsString, MaxLength } from 'class-validator';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

export class CreateFlashcardDto {
  @IsEnum(VocabularyTopic)
  topic: VocabularyTopic;

  @IsString()
  @MaxLength(255)
  word: string;

  @IsString()
  definition: string;
}
