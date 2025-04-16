import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsEnum(['Vocabulary', 'Grammar'])
  topic: 'Vocabulary' | 'Grammar';

  @IsOptional()
  @IsEnum(['IT', 'Business', 'Finance'], { message: 'category must be one of IT, Business, Finance' })
  category?: 'IT' | 'Business' | 'Finance';

  @IsOptional()
  @IsEnum(['Tense', 'Passive Voice', 'Conditional Sentence'], { message: 'grammar_point must be one of Tense, Passive Voice, Conditional Sentence' })
  grammar_point?: 'Tense' | 'Passive Voice' | 'Conditional Sentence';

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';

  @IsString()
  @IsNotEmpty()
  question_text: string;
}
