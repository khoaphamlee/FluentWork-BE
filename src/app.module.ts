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
console.log('🧪 process.env.DB_NAME:', process.env.DB_NAME);

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // useFactory: (configService: ConfigService) => {
      //   return {
      //     type: 'postgres',
      //     host: configService.get('DB_HOST'),
      //     port: +configService.get('DB_PORT'),
      //     username: configService.get('DB_USERNAME'),
      //     password: configService.get('DB_PASSWORD'),
      //     database: configService.get('DB_NAME'),
      //     entities: [User],
      //     synchronize: true,
      //   };
      // }
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
            LearningPath],
          synchronize: true, // Cẩn thận khi sử dụng synchronize trong môi trường production
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
    LearningPathsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
