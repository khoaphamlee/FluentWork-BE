import { Discussion } from 'src/discussions/entities/discussion.entity';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { Level } from 'src/enum/level.enum';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { LearningPathLesson } from 'src/learning-path-lessons/entities/learning-path-lesson.entity';
import { LearningPath } from 'src/learning-paths/entities/learning-path.entity';
import { LessonProgress } from 'src/lesson-progresses/entities/lesson-progress.entity';
import { LessonQa } from 'src/lesson-qas/entities/lesson-qa.entity';
import { LessonQuestion } from 'src/lesson-questions/entities/lesson-question.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'lessons' })
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'default_order', default: 0 })
    defaultOrder: number;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 500 })
    description: string;

    @Column({
        type: 'enum',
        enum: Level,
    })
    level: Level;

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

    @Column('text')
    content: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Discussion, (discussion) => discussion.lesson)
    discussions: Discussion[];

    @OneToMany(() => LearningPathLesson, (lpl) => lpl.lesson)
    learningPathLessons: LearningPathLesson[];

    @OneToMany(() => LessonQuestion, (lessonQuestion) => lessonQuestion.lesson)
    lessonQuestions: LessonQuestion[];

    @OneToMany(() => LessonQa, (qa) => qa.lesson)
    lessonQas: LessonQa[];

    @OneToMany(() => LessonProgress, (progress) => progress.lesson)
    lessonProgresses: LessonProgress[];

}
