import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getLearnerProfileSummary(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['learnerProfile'],
    });

    if (!user || !user.learnerProfile) {
      throw new NotFoundException('Learner profile not found');
    }

    const totalLessonsStarted = await this.lessonProgressRepo.count({
      where: { user: { id: userId } },
    });

    return {
      fullName: user.fullname,
      email: user.email,
      level: user.learnerProfile.level,
      registeredAt: user.created_at,
      totalLessonsStarted,
      totalLessonsCompleted: user.learnerProfile.total_lessons_completed,
    };
  }
  async getProgressSummary(userId: number) {
    const totalLessons = await this.lessonProgressRepo.count({
      where: { user: { id: userId } },
    });

    const completedLessons = await this.lessonProgressRepo.count({
      where: {
        user: { id: userId },
        status: 'Completed',
      },
    });

    const completionRate =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      totalLessons,
      completedLessons,
      completionRate,
    };
  }
  async getRecentActivity(userId: number) {
    const recent = await this.lessonProgressRepo.find({
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
      take: 5,
      relations: ['lesson'],
    });

    return recent.map((lp) => ({
      lessonTitle: lp.lesson.title,
      status: lp.status,
      correctAnswers: lp.total_correct_answers,
      totalQuestions: lp.lesson.lessonQuestions?.length ?? 10, // giả định nếu không có quan hệ
      learnedAt: lp.completed_at || lp.started_at || lp.updatedAt,
    }));
  }
}
