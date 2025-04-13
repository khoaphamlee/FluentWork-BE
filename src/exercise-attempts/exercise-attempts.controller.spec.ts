import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseAttemptsController } from './exercise-attempts.controller';
import { ExerciseAttemptsService } from './exercise-attempts.service';

describe('ExerciseAttemptsController', () => {
  let controller: ExerciseAttemptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseAttemptsController],
      providers: [ExerciseAttemptsService],
    }).compile();

    controller = module.get<ExerciseAttemptsController>(ExerciseAttemptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
