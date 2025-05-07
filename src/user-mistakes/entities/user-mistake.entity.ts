import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from 'src/users/entities/user.entity';
  import { GrammarTopic } from 'src/enum/grammar-topic.enum';
  import { Topic } from 'src/enum/topic.enum';
  import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
  
  @Entity({ name: 'user_mistakes' })
  export class UserMistake {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({
      type: 'enum',
      enum: Topic,
    })
    type: Topic;
  
    @Column({
      type: 'enum',
      enum: VocabularyTopic,
      nullable: true,
    })
    vocabulary_topic: VocabularyTopic | null; 
  
    @Column({
      type: 'enum',
      enum: GrammarTopic,
      nullable: true,
    })
    grammar_topic: GrammarTopic | null;
  
    @Column()
    total_mistake_count: number;
  
    @Column({ type: 'timestamp' })
    last_updated: Date;
  }
  