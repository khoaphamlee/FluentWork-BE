import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
  } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Level } from 'src/enum/level.enum';
  
@Entity({ name: 'learner_profiles' })
@Unique(['user_id'])
export class LearnerProfile {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: number;
  
    @Column({
      type: 'enum',
      enum: Level,
      default: 'Beginner',
    })
    level: Level;
  
    @Column({ default: 0 })
    total_lessons_completed: number;
  
    @Column({ type: 'timestamp', nullable: true })
    last_activity_date: Date;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
}
  