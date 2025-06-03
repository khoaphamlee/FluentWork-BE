import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
  } from 'typeorm';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { TestAnswer } from 'src/test-answers/entities/test-answer.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Test } from 'src/tests/entities/test.entity';
  
@Entity({ name: 'test_questions' })
export class TestQuestion {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Test, (test) => test.testQuestions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'test_id' })
    test: Test;

    @OneToMany(() => TestAnswer, (answer) => answer.testQuestion)
    answer: TestAnswer[];

    @ManyToOne(() => Question, (question) => question.testQuestion, {
        onDelete: 'CASCADE',  
    })
    @JoinColumn({ name: 'question_id' }) 
    question: Question;
}
  