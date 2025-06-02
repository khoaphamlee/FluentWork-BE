import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LearnerProfile } from 'src/learner-profiles/entities/learner-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LearnerProfile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
