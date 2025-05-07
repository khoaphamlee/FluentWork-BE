import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsDate, IsString, IsEnum } from 'class-validator';
import { Level } from 'src/enum/level.enum';

export class UpdateTestDto {
  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsEnum(Level)  // Use the enum
  level?: Level;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @Type(() => Date) // Add this for date conversion
  @IsDate()
  test_date?: Date;

  @IsOptional()
  @IsNumber()
  total_correct_answer?: number;

  @IsOptional()
  @IsNumber()
  total_incorrect_answer?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  testTemplateId?: number;
}