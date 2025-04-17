import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { TestAnswer } from 'src/test-answers/entities/test-answer.entity';
  
@Entity({ name: 'tests' })
export class Test {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column('float')
    score: number;
  
    @Column({
      type: 'enum',
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    })
    proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';
  
    @Column({ type: 'interval' })
    duration: string;
  
    @Column({ type: 'timestamp' })
    test_date: Date;

    @ManyToOne(() => TestTemplate, { nullable: true })
    @JoinColumn({ name: 'test_template_id' })
    testTemplate: TestTemplate;
    
    @Column({ default: 0 })
    total_correct_answers: number;
}
  