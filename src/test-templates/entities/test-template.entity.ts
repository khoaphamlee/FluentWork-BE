import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
  } from 'typeorm';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { TestAnswer } from 'src/test-answers/entities/test-answer.entity';
import { Test } from 'src/tests/entities/test.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Level } from 'src/enum/level.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
  
@Entity({ name: 'test_templates' })
export class TestTemplate {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({
        type: 'enum',
        enum: ['Vocabulary', 'Grammar', 'Mixed'],
    })
    type: 'Vocabulary' | 'Grammar' | 'Mixed';

    @Column({
        type: 'enum',
        enum: VocabularyTopic,
        array: true,
        nullable: true,
    })
    vocabulary_topic: VocabularyTopic[] | null;

    @Column({
        type: 'enum',
        enum: GrammarTopic,
        array: true,
        nullable: true,
    })
    grammar_topic: GrammarTopic[] | null;

    @Column({
        type: 'enum',
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All'],
    })
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
  
    @Column({ default: false })
    is_active: boolean;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Test, (test) => test.testTemplate)
    test: Test[];

    @OneToMany(() => Question, (question) => question.testTemplate) 
    questions: Question[];
}
  