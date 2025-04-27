import { Test, TestingModule } from '@nestjs/testing';
import { UserMistakesController } from './user-mistakes.controller';
import { UserMistakesService } from './user-mistakes.service';

describe('UserMistakesController', () => {
  let controller: UserMistakesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserMistakesController],
      providers: [UserMistakesService],
    }).compile();

    controller = module.get<UserMistakesController>(UserMistakesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
