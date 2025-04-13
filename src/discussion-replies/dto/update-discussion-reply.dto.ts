import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscussionReplyDto } from './create-discussion-reply.dto';

export class UpdateDiscussionReplyDto extends PartialType(CreateDiscussionReplyDto) {}
