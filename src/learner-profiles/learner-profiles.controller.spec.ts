import { Test, TestingModule } from '@nestjs/testing';
import { LearnerProfilesController } from './learner-profiles.controller';
import { LearnerProfilesService } from './learner-profiles.service';

describe('LearnerProfilesController', () => {
  let controller: LearnerProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearnerProfilesController],
      providers: [LearnerProfilesService],
    }).compile();

    controller = module.get<LearnerProfilesController>(LearnerProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
