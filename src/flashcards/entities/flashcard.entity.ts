import { ApiProperty } from '@nestjs/swagger';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'flashcards' })
export class Flashcard {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: VocabularyTopic,
  })
  topic: VocabularyTopic;

  @ApiProperty()
  @Column()
  word: string;

  @ApiProperty()
  @Column('text')
  definition: string;
}
