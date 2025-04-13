export class CreateLessonProgressDto {
    userId: number;
    lessonId: number;
    status: 'Not Started' | 'In Progress' | 'Completed';
    score?: number;
    started_at?: Date;
    completed_at?: Date;
}
  