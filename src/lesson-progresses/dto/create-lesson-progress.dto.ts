import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonProgressDto {
  @IsNumber()
  @ApiProperty({ example: 1, description: 'ID của bài học cần theo dõi' })
  lessonId: number;
}
