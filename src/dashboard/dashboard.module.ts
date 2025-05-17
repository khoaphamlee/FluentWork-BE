import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Test } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { Question } from 'src/questions/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Question, Lesson, Test])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
