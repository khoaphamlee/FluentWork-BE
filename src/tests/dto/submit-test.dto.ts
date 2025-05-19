import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @ApiProperty({ example: 101 })
  @IsNumber()
  testQuestionId: number;

  @ApiProperty({ example: 202 })
  @IsNumber()
  selectedOptionId: number;
}

export class SubmitTestDto {
  @ApiProperty({
    description: 'List of answers',
    type: [AnswerDto],
    example: [
      { testQuestionId: 101, selectedOptionId: 202 },
      { testQuestionId: 102, selectedOptionId: 205 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
