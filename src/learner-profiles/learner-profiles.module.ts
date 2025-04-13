import { Module } from '@nestjs/common';
import { LearnerProfilesService } from './learner-profiles.service';
import { LearnerProfilesController } from './learner-profiles.controller';

@Module({
  controllers: [LearnerProfilesController],
  providers: [LearnerProfilesService],
})
export class LearnerProfilesModule {}
