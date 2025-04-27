import { Module } from '@nestjs/common';
import { LessonQasService } from './lesson-qas.service';
import { LessonQasController } from './lesson-qas.controller';

@Module({
  controllers: [LessonQasController],
  providers: [LessonQasService],
})
export class LessonQasModule {}
