import { IsInt, IsEnum, IsOptional, IsDate, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateLessonProgressDto {
    @IsInt()
    @Min(1)
    userId: number;

    @IsInt()
    @Min(1)
    lessonId: number;

    @IsEnum(['Not Started', 'In Progress', 'Completed'])
    status: 'Not Started' | 'In Progress' | 'Completed';

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    score?: number;

    @IsOptional()
    @IsDate()
    started_at?: Date;

    @IsOptional()
    @IsDate()
    completed_at?: Date;
}
