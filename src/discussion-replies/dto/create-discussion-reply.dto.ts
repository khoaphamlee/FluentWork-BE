import { IsInt, IsString, IsDateString } from 'class-validator';

export class CreateDiscussionReplyDto {
  @IsInt()
  discussion_id: number;

  @IsInt()
  user_id: number;

  @IsString()
  reply_text: string;

  @IsDateString() 
  created_at?: Date;
}
