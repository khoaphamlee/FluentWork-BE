import {
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    IsUrl,
    IsArray,
    ArrayNotEmpty,
    ArrayUnique,
  } from 'class-validator';
  
  export enum LessonFocus {
    Vocabulary = 'Vocabulary',
    Grammar = 'Grammar',
  }
  
  export enum LessonSubject {
    IT = 'IT',
    Business = 'Business',
    Finance = 'Finance',
    Healthcare = 'Healthcare',
    Hospitality = 'Hospitality',
  }
  
  export enum GrammarPoint {
    Tense = 'Tense',
    PassiveVoice = 'Passive Voice',
    ConditionalSentence = 'Conditional Sentence',
  }
  
  export enum LessonType {
    Video = 'Video',
    Audio = 'Audio',
    Quiz = 'Quiz',
  }
  
  export class CreateLessonDto {
    @IsOptional()
    @IsEnum(LessonFocus)
    lesson_focus?: LessonFocus;
  
    @IsOptional()
    @IsEnum(LessonSubject)
    subject?: LessonSubject;
  
    @IsOptional()
    @IsEnum(GrammarPoint)
    grammar_point?: GrammarPoint;
  
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsEnum(LessonType, { each: true })
    lesson_type: LessonType[];
  
    @IsUrl()
    content_url: string;
  
    @IsString()
    @MaxLength(255)
    title: string;
  
    @IsString()
    @MaxLength(1000)
    description: string;
  }
  