import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestMistakesService } from './test-mistakes.service';
import { TestMistakesController } from './test-mistakes.controller';
import { TestMistake } from './entities/test-mistake.entity';
import { UserMistake } from 'src/user-mistakes/entities/user-mistake.entity';
import { UserMistakesService } from 'src/user-mistakes/user-mistakes.service';
import { UserMistakesModule } from 'src/user-mistakes/user-mistakes.module';

@Module({
  imports: [TypeOrmModule.forFeature([TestMistake, UserMistake]), UserMistakesModule],
  controllers: [TestMistakesController],
  providers: [TestMistakesService],
})
export class TestMistakesModule {}
