import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionRepliesController } from './discussion-replies.controller';
import { DiscussionRepliesService } from './discussion-replies.service';

describe('DiscussionRepliesController', () => {
  let controller: DiscussionRepliesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionRepliesController],
      providers: [DiscussionRepliesService],
    }).compile();

    controller = module.get<DiscussionRepliesController>(DiscussionRepliesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
