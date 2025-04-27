import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'flashcards' })
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['IT', 'Business', 'Finance'],
  })
  topic: 'IT' | 'Business' | 'Finance';

  @Column()
  word: string;

  @Column('text')
  definition: string;
}
