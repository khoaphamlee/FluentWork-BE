import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    OneToOne,
  } from 'typeorm';
  import { TestQuestion } from '../../test-questions/entities/test-question.entity';
  import { User } from '../../users/entities/user.entity';
  import { Option } from '../../options/entities/option.entity';
  
  @Entity({ name: 'test_answers' })
  export class TestAnswer {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => TestQuestion, (question) => question.answer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'test_question_id' })
    testQuestion: TestQuestion;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Option)
    @JoinColumn({ name: 'option_id' })
    option: Option;
  
    @Column({ default: false })
    is_correct: boolean;
  
    @CreateDateColumn({ name: 'answered_at' })
    answeredAt: Date;
  }
  