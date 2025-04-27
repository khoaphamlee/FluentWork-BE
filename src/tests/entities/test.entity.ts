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
  
@Entity({ name: 'tests' })
export class Test {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @OneToOne(() => TestTemplate)
    @JoinColumn({ name: 'test_template_id' })
    testTemplate: TestTemplate;

    @OneToMany(() => TestMistake, (mistake) => mistake.test, { cascade: true })
    testMistakes: TestMistake[];

    @Column('float')
    score: number;
  
    @Column({
      type: 'enum',
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    })
    level: 'Beginner' | 'Intermediate' | 'Advanced';
  
    @Column({ type: 'interval' })
    duration: string;
  
    @Column({ type: 'timestamp' })
    test_date: Date;
  
    @Column({ default: 0 })
    total_correct_answer: number;
  
    @Column({ default: 0 })
    total_incorrect_answer: number;
}
  