import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Level } from 'src/enum/level.enum';

export class CreateLearningPathDto {
  @IsString()
  title: string; 

  @IsEnum(Level)
  level: Level;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  userId?: number; 
}
