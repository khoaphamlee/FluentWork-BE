import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['Vocabulary', 'Grammar'],
  })
  topic: 'Vocabulary' | 'Grammar';

  @Column({
    type: 'enum',
    enum: ['IT', 'Business', 'Finance'],
    nullable: true,
  })
  category: 'IT' | 'Business' | 'Finance' | null;

  @Column({
    type: 'enum',
    enum: ['Tense', 'Passive Voice', 'Conditional Sentence'],
    nullable: true,
  })
  grammar_point: 'Tense' | 'Passive Voice' | 'Conditional Sentence' | null;
  
  @Column({
    type: 'enum',
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  })
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';

  @Column('text')
  question_text: string;
}
