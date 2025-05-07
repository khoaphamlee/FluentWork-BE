import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';

export class CreateUserMistakeDto {
  @IsEnum(Topic)
  @IsNotEmpty()
  type: Topic;

  @IsOptional()
  @IsEnum(VocabularyTopic)
  vocabulary_topic: VocabularyTopic | null;

  @IsOptional()
  @IsEnum(GrammarTopic)
  grammar_topic: GrammarTopic | null;

  @IsNumber()
  @IsNotEmpty()
  total_mistake_count: number;

  @IsDate()
  @IsNotEmpty()
  last_updated: Date;
}
