import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Question } from 'src/questions/entities/question.entity';
import { LessonAnswer } from 'src/lesson-answers/entities/lesson-answer.entity';
import { TestAnswer } from 'src/test-answers/entities/test-answer.entity';
  
@Entity({ name: 'options' })
export class Option {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Question, (question) => question.options, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'question_id' })
    question: Question;
      
    @Column()
    option_text: string;
  
    @Column()
    is_correct: boolean;
  
    @Column('text', { nullable: true })
    explanation: string;

    @OneToMany(() => LessonAnswer, (lessonAnswer) => lessonAnswer.option)
    lessonAnswers: LessonAnswer[];

    @OneToMany(() => TestAnswer, (testAnswer) => testAnswer.option)
    testAnswers: TestAnswer[];
}
  