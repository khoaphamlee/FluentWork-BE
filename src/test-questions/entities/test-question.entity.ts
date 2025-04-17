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
  
  @Entity({ name: 'test_questions' })
  export class TestQuestion {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => TestTemplate, (template) => template.questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'test_template_id' })
    testTemplate: TestTemplate;
  
    @Column('text')
    question_text: string;
  
    @Column('text', { array: true })
    options: string[];
  
    @Column()
    correct_answer_index: number;
  
    @OneToOne(() => TestAnswer, (answer) => answer.testQuestion)
    answer: TestAnswer;
}
  