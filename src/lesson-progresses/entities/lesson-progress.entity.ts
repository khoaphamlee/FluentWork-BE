import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Lesson } from '../../lessons/entities/lesson.entity';
  
  @Entity({ name: 'lesson_progress' })
  export class LessonProgress {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lesson_id' })
    lesson: Lesson;
  
    @Column({
      type: 'enum',
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    })
    status: 'Not Started' | 'In Progress' | 'Completed';
  
    @Column({ type: 'int', default: 0 })
    total_correct_answers: number;
  
    @Column({ type: 'timestamp', nullable: true })
    started_at: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    completed_at: Date;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  