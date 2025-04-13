export class CreateLessonDto {
    subject: 'IT' | 'Business' | 'Finance' | 'Healthcare' | 'Hospitality';
    lesson_type: 'Video' | 'Audio' | 'Quiz';
    content_url: string;
    title: string;
    description: string;
}
  