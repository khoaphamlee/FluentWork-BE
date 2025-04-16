import { IsInt, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateDiscussionDto {
  @IsInt()
  user_id: number;

  @IsInt()
  lesson_id: number;

  @IsString()
  question_text: string;

  @IsOptional() 
  @IsDateString()
  created_at?: Date;
}
