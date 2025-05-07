import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMistakesService } from './user-mistakes.service';
import { UserMistakesController } from './user-mistakes.controller';
import { UserMistake } from './entities/user-mistake.entity'; 
import { UsersModule } from 'src/users/users.module'; 
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMistake, User]),
    UsersModule,
  ],
  controllers: [UserMistakesController],
  providers: [UserMistakesService],
  exports: [UserMistakesService],
})
export class UserMistakesModule {}
