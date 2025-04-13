import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Discussion } from 'src/discussions/entities/discussion.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'discussion_replies' })
export class DiscussionReply {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Discussion, discussion => discussion.replies)
  @JoinColumn({ name: 'discussion_id' })
  discussion: Discussion;

  @ManyToOne(() => User, user => user.replies)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text')
  reply_text: string;

  @Column('timestamp')
  created_at: Date;
}
