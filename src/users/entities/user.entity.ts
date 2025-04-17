import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { DiscussionReply } from 'src/discussion-replies/entities/discussion-reply.entity';
import { Discussion } from 'src/discussions/entities/discussion.entity';
import { LearningPath } from 'src/learning-paths/entities/learning-path.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  fullname: string;

  @Exclude()
  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: ['Admin', 'Learner', 'Instructor'],
    default: 'Learner',
  })
  role: 'Admin' | 'Learner' | 'Instructor';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Discussion, (discussion) => discussion.user)
  discussions: Discussion[];

  @OneToMany(() => DiscussionReply, (reply) => reply.user)
  replies: DiscussionReply[];

  @OneToOne(() => LearningPath, (learningPath) => learningPath)
  learningPath: LearningPath;
}
