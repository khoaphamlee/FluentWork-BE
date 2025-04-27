import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
  } from 'typeorm';
  import { Lesson } from 'src/lessons/entities/lesson.entity';
  import { User } from 'src/users/entities/user.entity';
import { LearningPathLesson } from 'src/learning-path-lessons/entities/learning-path-lesson.entity';
  
  @Entity({ name: 'learning_paths' })
  export class LearningPath {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({
      type: 'enum',
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    })
    level: 'Beginner' | 'Intermediate' | 'Advanced';
  
    @Column({ length: 255 })
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @OneToMany(() => LearningPathLesson, (learningPathLesson) => learningPathLesson.learningPath)
    learningPathLessons: LearningPathLesson[];
  }
  