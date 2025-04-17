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
  
  @Entity({ name: 'test_questions' })
  export class TestQuestion {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => TestTemplate, (template) => template.questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'test_template_id' })
    testTemplate: TestTemplate;
  
    @OneToOne(() => TestAnswer, (answer) => answer.testQuestion)
    answer: TestAnswer;

    @OneToOne(() => Question, (question) => question.testQuestion, {
        eager: false,     
        cascade: false,  
    })
    @JoinColumn({ name: 'question_id' }) 
    question: Question;
}
  