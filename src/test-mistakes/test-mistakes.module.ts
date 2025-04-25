import { Module } from '@nestjs/common';
import { TestMistakesService } from './test-mistakes.service';
import { TestMistakesController } from './test-mistakes.controller';

@Module({
  controllers: [TestMistakesController],
  providers: [TestMistakesService],
})
export class TestMistakesModule {}
