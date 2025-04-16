import { IsEnum, IsString, MaxLength } from 'class-validator';

export class CreateFlashcardDto {
  @IsEnum(['IT', 'Business', 'Finance'])
  category: 'IT' | 'Business' | 'Finance';

  @IsString()
  @MaxLength(255)
  term: string;

  @IsString()
  definition: string;
}
