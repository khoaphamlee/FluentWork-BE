import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    OneToMany,
  } from 'typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';
import { LessonQaAnswer } from 'src/lesson-qa-answers/entities/lesson-qa-answer.entity';
  
@Entity({ name: 'lesson_qa' })
export class LessonQa {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lesson_id' })
    lesson: Lesson;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => LessonQaAnswer, (answer) => answer.lessonQa, { cascade: true })
    answers: LessonQaAnswer[];
  
    @Column({ type: 'text' })
    content: string;
  
    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
  