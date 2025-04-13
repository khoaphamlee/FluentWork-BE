import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';
import { Option } from '../../options/entities/option.entity';

@Entity({ name: 'exercise_attempts' })
export class ExerciseAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  question_id: number;

  @Column()
  selected_option_id: number;

  @Column({ default: false })
  is_correct: boolean;

  @Column({ type: 'timestamp' })
  answered_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Option)
  @JoinColumn({ name: 'selected_option_id' })
  selectedOption: Option;
}
