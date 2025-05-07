import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Test } from 'src/tests/entities/test.entity';
  import { GrammarTopic } from 'src/enum/grammar-topic.enum';
  import { Topic } from 'src/enum/topic.enum'; 
  import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum'; 
  
  @Entity({ name: 'test_mistakes' })
  export class TestMistake {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Test, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'test_id' })
    test: Test;
  
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
    mistake_count: number;
  }
  