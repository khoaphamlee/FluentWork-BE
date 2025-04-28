import { ApiProperty } from '@nestjs/swagger';

export class ReturnTestTemplateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: ['Vocabulary', 'Grammar', 'Mixed'] })
  topic: 'Vocabulary' | 'Grammar' | 'Mixed';

  @ApiProperty({
    type: [String],
    enum: ['IT', 'Business', 'Finance'],
    required: false,
  })
  vocabulary_topic?: ('IT' | 'Business' | 'Finance')[];

  @ApiProperty({
    type: [String],
    enum: ['Tense', 'Passive Voice', 'Conditional Sentence'],
    required: false,
  })
  grammar_topic?: ('Tense' | 'Passive Voice' | 'Conditional Sentence')[];

  @ApiProperty({
    type: [String],
    enum: ['Beginner', 'Intermidiate', 'Advanced'],
    required: false,
  })
  level?: ('Beginner' | 'Intermidiate' | 'Advanced');

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
