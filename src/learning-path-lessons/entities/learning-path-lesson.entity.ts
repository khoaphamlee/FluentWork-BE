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
  
  @Entity({ name: 'learning_path_lesson' })
  export class LearningPathLesson {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => LearningPath, (learningPath) => learningPath.learningPathLessons, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'learning_path_id' })
    learningPath: LearningPath;

    @ManyToOne(() => Lesson, (lesson) => lesson.learningPathLessons, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lesson_id' })
    lesson: Lesson;
  
    @Column()
    order: number;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  