import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { TestQuestion } from '../../test-questions/entities/test-question.entity';
  
@Entity({ name: 'test_answers' })
export class TestAnswer {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => TestQuestion)
    @JoinColumn({ name: 'test_question_id' })
    testQuestion: TestQuestion;
  
    @Column('text')
    answer: string;
  
    @Column({ default: false })
    is_correct: boolean;
}
  
  