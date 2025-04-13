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
          entities: [User],
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
    DiscussionRepliesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
