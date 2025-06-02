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

// learner-profile.entity.ts
@Entity({ name: 'learner_profiles' })
@Unique(['user'])
export class LearnerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: Level,
    default: 'Beginner',
  })
  level: Level;

  @Column({ default: 0 })
  total_lessons_completed: number;

  // @Column({ type: 'timestamp', nullable: true })
  // last_activity_date: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
    hasCreatedPlacement: boolean;

    @Column({ default: false })
    hasSubmittedPlacement: boolean;

}
