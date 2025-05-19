import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsDate, IsString, IsEnum } from 'class-validator';
import { Level } from 'src/enum/level.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTestDto {
  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiPropertyOptional({ enum: Level, example: 'Intermediate' })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @ApiPropertyOptional({ example: '12m' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ example: '2025-05-18T10:00:00Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  test_date?: Date;

  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @IsNumber()
  total_correct_answers?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  total_incorrect_answers?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  testTemplateId?: number;
}
