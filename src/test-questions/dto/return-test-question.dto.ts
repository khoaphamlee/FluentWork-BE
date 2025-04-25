import { ApiProperty } from '@nestjs/swagger';

export class ReturnTestQuestionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  test_template_id: number;

  @ApiProperty()
  question_id: number;
}
