import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateTestTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
