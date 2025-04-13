import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Entity({ name: 'learning_paths' })
export class LearningPath {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['Beginner', 'Intermediate', 'Advanced'] })
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced'; 

  @Column({ type: 'enum', enum: ['IT', 'Business', 'Finance', 'Healthcare', 'Hospitality', 'Other'], nullable: true })
  category: 'IT' | 'Business' | 'Finance' | 'Healthcare' | 'Hospitality' | 'Other' | null; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Lesson, lesson => lesson.learningPath)
  lessons: Lesson[];
}
