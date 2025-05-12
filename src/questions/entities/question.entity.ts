import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Option } from 'src/options/entities/option.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { LessonQuestion } from 'src/lesson-questions/entities/lesson-question.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { Topic } from 'src/enum/topic.enum';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { Level } from 'src/enum/level.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';


@Entity({ name: 'questions' })
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({
        type: 'enum',
        enum: Level,
        default: Level.BEGINNER,
    })
    level: Level;

    @Column('text')
    question_text: string;

    @Column('text', { nullable: true })
    explanation: string;

    @OneToMany(() => Option, (option) => option.question, { cascade: true })
    options: Option[];

    @OneToMany(() => TestQuestion, (testQuestion) => testQuestion.question)
    testQuestion: TestQuestion[];

    @OneToMany(() => LessonQuestion, (lessonQuestion) => lessonQuestion.question)
    lessonQuestion: LessonQuestion[];

    @ManyToOne(() => TestTemplate, (testTemplate) => testTemplate.questions)
    testTemplate: TestTemplate;
}
