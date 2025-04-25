import { Test, TestingModule } from '@nestjs/testing';
import { UserMistakesService } from './user-mistakes.service';

describe('UserMistakesService', () => {
  let service: UserMistakesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMistakesService],
    }).compile();

    service = module.get<UserMistakesService>(UserMistakesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
