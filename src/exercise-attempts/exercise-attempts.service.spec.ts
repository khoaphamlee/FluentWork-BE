import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseAttemptsService } from './exercise-attempts.service';

describe('ExerciseAttemptsService', () => {
  let service: ExerciseAttemptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseAttemptsService],
    }).compile();

    service = module.get<ExerciseAttemptsService>(ExerciseAttemptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
