import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Question } from '../questions/entities/question.entity';
import { Test } from '../tests/entities/test.entity';
import { DateCountDto, RoleDistributionDto } from './dto/dashboard.dto';
import { Flashcard } from 'src/flashcards/entities/flashcard.entity';
import { LessonProgress } from 'src/lesson-progresses/entities/lesson-progress.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Flashcard) private flashCardRepo: Repository<Flashcard>,
    @InjectRepository(LessonProgress)
    private lessonProgressRepo: Repository<LessonProgress>,
  ) {}

  async getLearnerProfileSummary(userId: number): Promise<any> {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });

    const [started, completed] = await Promise.all([
      this.lessonProgressRepo.count({ where: { user: { id: userId } } }),
      this.lessonProgressRepo.count({
        where: { user: { id: userId }, status: 'Completed' },
      }),
    ]);

    return {
      fullName: user.fullname,
      email: user.email,
      // currentLevel: user.proficiencyLevel,
      // registrationDate: user.createdAt,
      lessonsStarted: started,
      lessonsCompleted: completed,
    };
  }

  async getSummary(): Promise<Record<string, number>> {
    const [totalUsers, totalLessons, totalQuestions, totalFlashcards] =
      await Promise.all([
        this.userRepo.count(),
        this.lessonRepo.count(),
        this.questionRepo.count(),
        this.flashCardRepo.count(),
      ]);
    return { totalUsers, totalLessons, totalQuestions, totalFlashcards };
  }

  async getLearnersPerDay(): Promise<DateCountDto[]> {
    const raw = await this.userRepo.query(
      `SELECT TO_CHAR(created_at::date, 'YYYY-MM-DD') AS date, COUNT(*)::int AS count
       FROM users
       WHERE role = 'Learner'
       GROUP BY created_at::date
       ORDER BY created_at::date`,
    );
    return raw;
  }

  async getUserRoleDistribution(): Promise<RoleDistributionDto[]> {
    const totalUsers = await this.userRepo.count();
    const raw = await this.userRepo.query(
      `SELECT role, ROUND(COUNT(*) * 100.0 / $1, 2)::float AS count
       FROM users
       GROUP BY role`,
      [totalUsers],
    );
    return raw;
  }
}
