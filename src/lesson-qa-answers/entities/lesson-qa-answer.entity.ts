import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { LessonQa } from 'src/lesson-qas/entities/lesson-qa.entity';
import { User } from 'src/users/entities/user.entity';
  
@Entity({ name: 'lesson_qa_answers' })
export class LessonQaAnswer {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => LessonQa, (lessonQa) => lessonQa.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lesson_qa_id' })
    lessonQa: LessonQa;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ type: 'text' })
    answer: string;
  
    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
  