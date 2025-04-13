import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseAttemptDto } from './create-exercise-attempt.dto';

export class UpdateExerciseAttemptDto extends PartialType(CreateExerciseAttemptDto) {}
