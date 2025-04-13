import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'flashcards' })
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['IT', 'Business', 'Finance'],
  })
  category: 'IT' | 'Business' | 'Finance';

  @Column()
  term: string;

  @Column('text')
  definition: string;
}
