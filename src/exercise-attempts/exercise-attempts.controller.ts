import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExerciseAttemptsService } from './exercise-attempts.service';
import { CreateExerciseAttemptDto } from './dto/create-exercise-attempt.dto';
import { UpdateExerciseAttemptDto } from './dto/update-exercise-attempt.dto';

@Controller('exercise-attempts')
export class ExerciseAttemptsController {
  constructor(private readonly exerciseAttemptsService: ExerciseAttemptsService) {}

  @Post()
  create(@Body() createExerciseAttemptDto: CreateExerciseAttemptDto) {
    return this.exerciseAttemptsService.create(createExerciseAttemptDto);
  }

  @Get()
  findAll() {
    return this.exerciseAttemptsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseAttemptsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseAttemptDto: UpdateExerciseAttemptDto) {
    return this.exerciseAttemptsService.update(+id, updateExerciseAttemptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseAttemptsService.remove(+id);
  }
}
