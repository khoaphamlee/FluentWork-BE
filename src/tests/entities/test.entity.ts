import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
  
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
}
  