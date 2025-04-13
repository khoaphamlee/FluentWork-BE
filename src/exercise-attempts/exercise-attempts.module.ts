import { Module } from '@nestjs/common';
import { ExerciseAttemptsService } from './exercise-attempts.service';
import { ExerciseAttemptsController } from './exercise-attempts.controller';

@Module({
  controllers: [ExerciseAttemptsController],
  providers: [ExerciseAttemptsService],
})
export class ExerciseAttemptsModule {}
