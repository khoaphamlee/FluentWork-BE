import { IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { Topic } from 'src/enum/topic.enum';

export class CreateTestMistakeDto {
  @IsNumber()
  @IsNotEmpty()
  test_id: number;

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
  mistake_count: number; 
}
