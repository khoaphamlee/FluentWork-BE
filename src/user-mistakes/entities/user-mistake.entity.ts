import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from 'src/users/entities/user.entity';
  
  @Entity({ name: 'user_mistakes' })
  export class UserMistake {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({
      type: 'enum',
      enum: ['Vocabulary', 'Grammar'],
    })
    type: 'Vocabulary' | 'Grammar';
  
    @Column({
      type: 'enum',
      enum: ['IT', 'Business', 'Finance'],
      nullable: true,
    })
    vocabulary_topic: 'IT' | 'Business' | 'Finance' | null;
  
    @Column({
      type: 'enum',
      enum: ['Tense', 'Passive Voice', 'Conditional Sentence'],
      nullable: true,
    })
    grammar_topic: 'Tense' | 'Passive Voice' | 'Conditional Sentence' | null;
  
    @Column()
    total_mistake_count: number;
  
    @Column({ type: 'timestamp' })
    last_updated: Date;
  }  