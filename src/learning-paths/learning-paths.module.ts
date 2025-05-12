import { Module } from '@nestjs/common';
import { LearningPathsService } from './learning-paths.service';
import { LearningPathsController } from './learning-paths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningPath } from './entities/learning-path.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LearningPath])],
    controllers: [LearningPathsController],
    providers: [LearningPathsService],
})
export class LearningPathsModule {}
