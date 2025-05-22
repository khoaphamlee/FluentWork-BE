import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
  } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LessonQuestion } from 'src/lesson-questions/entities/lesson-question.entity';
import { Option } from 'src/options/entities/option.entity';
  
@Entity({ name: 'lesson_answers' })
export class LessonAnswer {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => LessonQuestion, (lessonQuestion) => lessonQuestion.lessonAnswers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lesson_question_id' })
    lessonQuestion: LessonQuestion;

    @ManyToOne(() => Option)
    @JoinColumn({ name: 'option_id' })
    option: Option;
  
    @Column({ default: false })
    is_correct: boolean;
  
    @CreateDateColumn({ name: 'answered_at' })
    answeredAt: Date;
}
  