import { Module } from '@nestjs/common';
import { LearnerProfilesService } from './learner-profiles.service';
import { LearnerProfilesController } from './learner-profiles.controller';
import { LearnerProfile } from './entities/learner-profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LearnerProfile]), // chỉ truyền entity vào đây
    UsersModule, // import bình thường
  ],

  controllers: [LearnerProfilesController],
  providers: [LearnerProfilesService],
  exports: [LearnerProfilesService, TypeOrmModule],
})
export class LearnerProfilesModule {}
