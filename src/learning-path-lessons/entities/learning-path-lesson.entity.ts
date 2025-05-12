import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { LearningPath } from 'src/learning-paths/entities/learning-path.entity';
  import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Topic } from 'src/enum/topic.enum';
  
  @Entity({ name: 'learning_path_lessons' })
export class LearningPathLesson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LearningPath, (lp) => lp.learningPathLessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'learning_path_id' })
  learningPath: LearningPath;

  @ManyToOne(() => Lesson, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({ type: 'enum', enum: Topic })
  type: Topic;

  @Column({ nullable: true })
  topic: string;

  @Column({ type: 'int' })
  order: number;
}

  