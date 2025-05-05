import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'flashcards' })
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: VocabularyTopic,
  })
  topic: VocabularyTopic;

  @Column()
  word: string;

  @Column('text')
  definition: string;
}
