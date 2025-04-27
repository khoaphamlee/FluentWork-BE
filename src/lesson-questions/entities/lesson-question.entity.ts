import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Question } from 'src/questions/entities/question.entity';
import { LessonAnswer } from 'src/lesson-answers/entities/lesson-answer.entity';
  
@Entity({ name: 'lesson_questions' })
export class LessonQuestion {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Lesson, (lesson) => lesson.lessonQuestions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'lesson_id' })
    lesson: Lesson;
      
    @ManyToOne(() => Question, (question) => question.lessonQuestion, { 
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @OneToMany(() => LessonAnswer, (lessonAnswer) => lessonAnswer.lessonQuestion)
    lessonAnswers: LessonAnswer[];

}
  