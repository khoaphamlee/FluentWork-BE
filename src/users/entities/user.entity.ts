import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { DiscussionReply } from 'src/discussion-replies/entities/discussion-reply.entity';
import { Discussion } from 'src/discussions/entities/discussion.entity';
import { LearnerProfile } from 'src/learner-profiles/entities/learner-profile.entity';
import { LearningPath } from 'src/learning-paths/entities/learning-path.entity';
import { LessonAnswer } from 'src/lesson-answers/entities/lesson-answer.entity';
import { LessonProgress } from 'src/lesson-progresses/entities/lesson-progress.entity';
import { LessonQaAnswer } from 'src/lesson-qa-answers/entities/lesson-qa-answer.entity';
import { LessonQa } from 'src/lesson-qas/entities/lesson-qa.entity';
import { TestAnswer } from 'src/test-answers/entities/test-answer.entity';
import { Test } from 'src/tests/entities/test.entity';
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
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ unique: true })
    username: string;

    @ApiProperty()
    @Column({ unique: true })
    email: string;

    @ApiProperty()
    @Column()
    fullname: string;

    @ApiProperty()
    @Column()
    password_hash: string;

    @ApiProperty()
    @Column({
        type: 'enum',
        enum: ['Admin', 'Learner', 'Instructor'],
        default: 'Learner',
    })
    role: 'Admin' | 'Learner' | 'Instructor';

    @ApiProperty()
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Discussion, (discussion) => discussion.user)
    discussions: Discussion[];

    @OneToMany(() => DiscussionReply, (reply) => reply.user)
    replies: DiscussionReply[];

    @OneToOne(() => LearningPath, (learningPath) => learningPath)
    learningPath: LearningPath;

    @OneToMany(() => LessonAnswer, (lessonAnswer) => lessonAnswer.user)
    lessonAnswers: LessonAnswer[];

    @OneToOne(() => LessonProgress, (learnerProgress) => learnerProgress.user)
    learnerProgress: LessonProgress[];

    @OneToMany(() => Test, (test) => test.user)
    tests: Test[];

    @OneToMany(() => LessonQa, (qa) => qa.user)
    lessonQas: LessonQa[];

    @OneToMany(() => LessonQaAnswer, (qaAnswer) => qaAnswer.user)
    lessonQaAnswers: LessonQaAnswer[];

    @OneToOne(() => LearnerProfile, (learnerProfile) => learnerProfile.user)
    learnerProfile: LearnerProfile[];
}
