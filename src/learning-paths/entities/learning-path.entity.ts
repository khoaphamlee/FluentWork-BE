import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Entity({ name: 'learning_paths' })
export class LearningPath {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ['Grammar', 'Vocabulary'],
    nullable: true,
  })
  focus: 'Grammar' | 'Vocabulary' | null;  

  @Column({
    type: 'enum',
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  })
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced'; 

  @Column({
    type: 'enum',
    enum: ['IT', 'Business', 'Finance', 'Healthcare', 'Hospitality', 'Other'],
    nullable: true,
  })
  category: 'IT' | 'Business' | 'Finance' | 'Healthcare' | 'Hospitality' | 'Other' | null;

  @Column({
    type: 'enum',
    enum: ['Tense', 'Passive Voice', 'Conditional Sentence'],
    nullable: true,
  })
  grammar_point: 'Tense' | 'Passive Voice' | 'Conditional Sentence' | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Lesson, lesson => lesson.learningPath)
  lessons: Lesson[];
}
