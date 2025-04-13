import { Test, TestingModule } from '@nestjs/testing';
import { LearnerProfilesService } from './learner-profiles.service';

describe('LearnerProfilesService', () => {
  let service: LearnerProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearnerProfilesService],
    }).compile();

    service = module.get<LearnerProfilesService>(LearnerProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
