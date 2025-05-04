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
    topic: 'Vocabulary' | 'Grammar' | 'Mixed';

    @Column({
        type: 'enum',
        enum: ['IT', 'Business', 'Finance'],
        array: true,
        nullable: true,
    })
    vocabulary_topic: ('IT' | 'Business' | 'Finance')[] | null;

    @Column({
        type: 'enum',
        enum: ['Tense', 'Passive Voice', 'Conditional Sentence'],
        array: true,
        nullable: true,
    })
    grammar_topic: ('Tense' | 'Passive Voice' | 'Conditional Sentence')[] | null;

    @Column({
        type: 'enum',
        enum: ['Beginner', 'Intermediate', 'Advanced'],
    })
    level: 'Beginner' | 'Intermediate' | 'Advanced';
  
    @Column({ default: false })
    is_active: boolean;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Test, (test) => test.testTemplate)
    test: Test;

    @OneToMany(() => Question, (question) => question.testTemplate) // Quan hệ với Question
    questions: Question[];
}
  