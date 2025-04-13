import { Injectable } from '@nestjs/common';
import { CreateDiscussionReplyDto } from './dto/create-discussion-reply.dto';
import { UpdateDiscussionReplyDto } from './dto/update-discussion-reply.dto';

@Injectable()
export class DiscussionRepliesService {
  create(createDiscussionReplyDto: CreateDiscussionReplyDto) {
    return 'This action adds a new discussionReply';
  }

  findAll() {
    return `This action returns all discussionReplies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discussionReply`;
  }

  update(id: number, updateDiscussionReplyDto: UpdateDiscussionReplyDto) {
    return `This action updates a #${id} discussionReply`;
  }

  remove(id: number) {
    return `This action removes a #${id} discussionReply`;
  }
}
