import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionRepliesService } from './discussion-replies.service';

describe('DiscussionRepliesService', () => {
  let service: DiscussionRepliesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscussionRepliesService],
    }).compile();

    service = module.get<DiscussionRepliesService>(DiscussionRepliesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
