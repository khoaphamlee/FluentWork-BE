import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Test } from 'src/tests/entities/test.entity';
  
  @Entity({ name: 'test_mistakes' })
  export class TestMistake {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Test, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'test_id' })
    test: Test;
  
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
    mistake_count: number;
  }
  