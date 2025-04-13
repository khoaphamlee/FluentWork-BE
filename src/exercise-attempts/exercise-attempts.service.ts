import { Injectable } from '@nestjs/common';
import { CreateExerciseAttemptDto } from './dto/create-exercise-attempt.dto';
import { UpdateExerciseAttemptDto } from './dto/update-exercise-attempt.dto';

@Injectable()
export class ExerciseAttemptsService {
  create(createExerciseAttemptDto: CreateExerciseAttemptDto) {
    return 'This action adds a new exerciseAttempt';
  }

  findAll() {
    return `This action returns all exerciseAttempts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exerciseAttempt`;
  }

  update(id: number, updateExerciseAttemptDto: UpdateExerciseAttemptDto) {
    return `This action updates a #${id} exerciseAttempt`;
  }

  remove(id: number) {
    return `This action removes a #${id} exerciseAttempt`;
  }
}
