import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { TestMistake } from 'src/test-mistakes/entities/test-mistake.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { Level } from 'src/enum/level.enum';
  
@Entity({ name: 'tests' })
export class Test {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => TestTemplate)
    @JoinColumn({ name: 'test_template_id' })
    testTemplate: TestTemplate;

    @OneToMany(() => TestMistake, (mistake) => mistake.test, { cascade: true })
    testMistakes: TestMistake[];

    @OneToMany(() => TestQuestion, (testQuestion) => testQuestion.test, { cascade: true })
    testQuestions: TestQuestion[];

    @Column('float')
    score: number;

    @Column({
            type: 'enum',
            enum: Level,
            default: Level.BEGINNER,
        })
    level: Level;
  
    @Column({ type: 'interval' })
    duration: string;
  
    @Column({ type: 'timestamp' })
    test_date: Date;
  
    @Column({ default: 0 })
    total_correct_answer: number;
  
    @Column({ default: 0 })
    total_incorrect_answer: number;
}
  