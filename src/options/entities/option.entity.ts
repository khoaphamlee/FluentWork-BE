import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Question } from 'src/questions/entities/question.entity';
  
@Entity({ name: 'options' })
export class Option {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Question, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'question_id' })
    question: Question;
  
    @Column()
    option_text: string;
  
    @Column()
    is_correct: boolean;
  
    @Column('text', { nullable: true })
    explanation: string;
}
  