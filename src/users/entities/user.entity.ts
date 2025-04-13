import { DiscussionReply } from "src/discussion-replies/entities/discussion-reply.entity";
import { Discussion } from "src/discussions/entities/discussion.entity";
import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";

@Entity({name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password_hash: string;

    @Column({
        type: "enum",
        enum: ['Admin', 'Learner', 'Instructor'],
        default: 'Learner',
    })
    role: 'Admin' | 'Learner' | 'Instructor';

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Discussion, discussion => discussion.user)
    discussions: Discussion[];

    @OneToMany(() => DiscussionReply, reply => reply.user)
    replies: DiscussionReply[];
}
