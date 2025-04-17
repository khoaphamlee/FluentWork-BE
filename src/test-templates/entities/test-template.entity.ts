import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { TestAnswer } from 'src/test-answers/entities/test-answer.entity';
  
  @Entity({ name: 'test_templates' })
  export class TestTemplate {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @Column({ default: false })
    is_active: boolean;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @OneToMany(() => TestQuestion, (question) => question.testTemplate)
    questions: TestQuestion[];
}
  