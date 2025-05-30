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
import { Level } from 'src/enum/level.enum';
  
  @Entity({ name: 'learning_paths' })
  export class LearningPath {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({
      type: 'enum',
      enum: Level,
    })
    level: Level;
  
    @Column({ type: 'text', array: true, nullable: true }) 
    topics: string[];
 
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
  