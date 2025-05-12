import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  ValidateIf,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Topic } from 'src/enum/topic.enum';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

export class CreateLearningPathLessonDto {
  @IsInt()
  @Type(() => Number)
  learningPathId: number;

  @IsInt()
  @Type(() => Number)
  lessonId: number;

  @IsEnum(Topic)
  type: Topic;

  @ValidateIf((o) => o.type === Topic.GRAMMAR)
  @IsEnum(GrammarTopic, { message: 'Invalid grammar topic' })
  @ValidateIf((o) => o.type === Topic.VOCABULARY)
  @IsEnum(VocabularyTopic, { message: 'Invalid vocabulary topic' })
  topic?: GrammarTopic | VocabularyTopic;

  @IsInt()
  @Type(() => Number)
  order: number;
}
