import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

export interface FindFlashcardsDto {
  topic?: VocabularyTopic;
  word?: string;
  definition?: string;
}
