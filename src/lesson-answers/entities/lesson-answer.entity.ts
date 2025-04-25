import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LessonQuestion } from 'src/lesson-questions/entities/lesson-question.entity';
import { Option } from 'src/options/entities/option.entity';
  
@Entity({ name: 'lesson_answers' })
export class LessonAnswer {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => LessonQuestion, (lessonQuestion) => lessonQuestion.lessonAnswers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lesson_question_id' })
    lessonQuestion: LessonQuestion;
  
    @ManyToOne(() => Option, (option) => option.lessonAnswers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'option_id' })
    option: Option;
  
    @Column({ type: 'boolean' })
    is_correct: boolean;
  
    @Column({ type: 'timestamp' })
    answered_at: Date;
}
  