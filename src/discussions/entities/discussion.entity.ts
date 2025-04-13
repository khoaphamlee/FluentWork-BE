import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { DiscussionReply } from 'src/discussion-replies/entities/discussion-reply.entity';

@Entity({ name: 'discussions' })
export class Discussion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.discussions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Lesson, lesson => lesson.discussions)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column('text')
  question_text: string;

  @Column('datetime')
  created_at: Date;

  @OneToMany(() => DiscussionReply, reply => reply.discussion)
  replies: DiscussionReply[];
}
