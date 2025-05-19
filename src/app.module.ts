import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { LearnerProfilesModule } from './learner-profiles/learner-profiles.module';
import { ExerciseAttemptsModule } from './exercise-attempts/exercise-attempts.module';
import { TestsModule } from './tests/tests.module';
import { QuestionsModule } from './questions/questions.module';
import { OptionsModule } from './options/options.module';
import { LessonProgressesModule } from './lesson-progresses/lesson-progresses.module';
import { LessonsModule } from './lessons/lessons.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { DiscussionsModule } from './discussions/discussions.module';
import { DiscussionRepliesModule } from './discussion-replies/discussion-replies.module';
import { DiscussionReply } from './discussion-replies/entities/discussion-reply.entity';
import { Discussion } from './discussions/entities/discussion.entity';
import { ExerciseAttempt } from './exercise-attempts/entities/exercise-attempt.entity';
import { Flashcard } from './flashcards/entities/flashcard.entity';
import { LearnerProfile } from './learner-profiles/entities/learner-profile.entity';
import { LessonProgress } from './lesson-progresses/entities/lesson-progress.entity';
import { Lesson } from './lessons/entities/lesson.entity';
import { Question } from './questions/entities/question.entity';
import { Option } from './options/entities/option.entity';
import { Test } from './tests/entities/test.entity';
import { LearningPathsModule } from './learning-paths/learning-paths.module';
import { LearningPath } from './learning-paths/entities/learning-path.entity';
import { AuthModule } from './auth/auth.module';
import { TestQuestionsModule } from './test-questions/test-questions.module';
import { TestTemplatesModule } from './test-templates/test-templates.module';
import { TestAnswersModule } from './test-answers/test-answers.module';
import { TestAnswer } from './test-answers/entities/test-answer.entity';
import { TestQuestion } from './test-questions/entities/test-question.entity';
import { TestTemplate } from './test-templates/entities/test-template.entity';
import { LearningPathLessonsModule } from './learning-path-lessons/learning-path-lessons.module';
import { LessonQuestionsModule } from './lesson-questions/lesson-questions.module';
import { LessonAnswersModule } from './lesson-answers/lesson-answers.module';
import { TestMistakesModule } from './test-mistakes/test-mistakes.module';
import { UserMistakesModule } from './user-mistakes/user-mistakes.module';
import { LessonQasModule } from './lesson-qas/lesson-qas.module';
import { LessonQaAnswersModule } from './lesson-qa-answers/lesson-qa-answers.module';
import { LearningPathLesson } from './learning-path-lessons/entities/learning-path-lesson.entity';
import { LessonAnswer } from './lesson-answers/entities/lesson-answer.entity';
import { LessonQuestion } from './lesson-questions/entities/lesson-question.entity';
import { LessonQa } from './lesson-qas/entities/lesson-qa.entity';
import { LessonQaAnswer } from './lesson-qa-answers/entities/lesson-qa-answer.entity';
import { TestMistake } from './test-mistakes/entities/test-mistake.entity';
import { UserMistake } from './user-mistakes/entities/user-mistake.entity';
import { DashboardModule } from './dashboard/dashboard.module';
console.log('🧪 process.env.DB_NAME:', process.env.DB_NAME);

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get('DB_HOST');
        const dbPort = configService.get('DB_PORT');
        const dbUsername = configService.get('DB_USERNAME');
        const dbPassword = configService.get('DB_PASSWORD');
        const dbName = configService.get('DB_NAME');
        
        console.log('DB Host:', dbHost);
        console.log('DB Port:', dbPort);
        console.log('DB Username:', dbUsername);
        console.log('DB Name:', dbName);
      
        return {
          type: 'postgres',
          host: dbHost,
          port: +dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbName,
          entities: [User,
            LearnerProfile,
            ExerciseAttempt,
            Test,
            Question,
            Option,
            LessonProgress,
            Lesson,
            Flashcard,
            Discussion,
            DiscussionReply,
            LearningPath,
            TestAnswer,
            TestQuestion,
            TestTemplate,
            LearningPathLesson,
            LessonAnswer,
            LessonQuestion,
            LessonQa,
            LessonQaAnswer,
            TestMistake,
            UserMistake
          ],
          synchronize: true,
        };
      }
      
    }),
    UsersModule,
    LearnerProfilesModule,
    ExerciseAttemptsModule,
    TestsModule,
    QuestionsModule,
    OptionsModule,
    LessonProgressesModule,
    LessonsModule,
    FlashcardsModule,
    DiscussionsModule,
    DiscussionRepliesModule,
    LearningPathsModule,
    AuthModule,
    TestQuestionsModule,
    TestTemplatesModule,
    TestAnswersModule,
    LearningPathLessonsModule,
    LessonQuestionsModule,
    LessonAnswersModule,
    TestMistakesModule,
    UserMistakesModule,
    LessonQasModule,
    LessonQaAnswersModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}