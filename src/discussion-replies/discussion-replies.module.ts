import { Module } from '@nestjs/common';
import { DiscussionRepliesService } from './discussion-replies.service';
import { DiscussionRepliesController } from './discussion-replies.controller';

@Module({
  controllers: [DiscussionRepliesController],
  providers: [DiscussionRepliesService],
})
export class DiscussionRepliesModule {}
