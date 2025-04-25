import { Module } from '@nestjs/common';
import { UserMistakesService } from './user-mistakes.service';
import { UserMistakesController } from './user-mistakes.controller';

@Module({
  controllers: [UserMistakesController],
  providers: [UserMistakesService],
})
export class UserMistakesModule {}
