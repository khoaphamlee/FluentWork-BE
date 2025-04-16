import {
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
  
export enum LearningFocus {
    Grammar = 'Grammar',
    Vocabulary = 'Vocabulary',
}

export enum ProficiencyLevel {
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced',
}
  
export enum LearningCategory {
    IT = 'IT',
    Business = 'Business',
    Finance = 'Finance',
    Healthcare = 'Healthcare',
    Hospitality = 'Hospitality',
    Other = 'Other',
}
  
export enum GrammarPoint {
    Tense = 'Tense',
    PassiveVoice = 'Passive Voice',
    ConditionalSentence = 'Conditional Sentence',
}
  
export class CreateLearningPathDto {
    @IsString()
    @MaxLength(255)
    title: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsEnum(LearningFocus)
    @IsOptional()
    focus?: LearningFocus;
  
    @IsEnum(ProficiencyLevel)
    proficiency_level: ProficiencyLevel;
  
    @IsOptional()
    @IsEnum(LearningCategory)
    category?: LearningCategory;
  
    @IsOptional()
    @IsEnum(GrammarPoint)
    grammar_point?: GrammarPoint;
}
  