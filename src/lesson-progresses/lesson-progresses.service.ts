import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lesson } from '../lessons/entities/lesson.entity';
import { User } from '../users/entities/user.entity';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';
import { LessonProgress } from './entities/lesson-progress.entity';
import toVietnamTime from 'src/common/helper/toVietnamTime';

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly progressRepo: Repository<LessonProgress>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
  ) {}

  async create(userId: number, lessonId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });

    if (!user || !lesson)
      throw new NotFoundException(['User or lesson not found']);

    const progress = this.progressRepo.create({
      user,
      lesson,
      status: 'In Progress',
      started_at: new Date(),
    });

    const saved = await this.progressRepo.save(progress);

    return {
      message: ['Lesson progress started successfully'],
      ...saved,
      started_at: toVietnamTime(saved.started_at),
      completed_at: toVietnamTime(saved.completed_at),
    };
  }

  async findByUser(userId: number) {
    const progresses = await this.progressRepo.find({
      where: { user: { id: userId } },
      relations: ['lesson'],
    });

    return {
      message: ['Lesson progress retrieved successfully'],
      data: progresses.map((p) => ({
        ...p,
        started_at: toVietnamTime(p.started_at),
        completed_at: toVietnamTime(p.completed_at),
      })),
    };
  }

  async update(id: number, dto: UpdateLessonProgressDto) {
    const progress = await this.progressRepo.findOne({ where: { id } });
    if (!progress) throw new NotFoundException('Progress not found');

    Object.assign(progress, dto);
    if (dto.status === 'Completed' && !progress.completed_at) {
      progress.completed_at = new Date();
    }

    const updated = await this.progressRepo.save(progress);

    return {
      message: ['Lesson progress updated successfully'],
      ...updated,
      started_at: toVietnamTime(updated.started_at),
      completed_at: toVietnamTime(updated.completed_at),
    };
  }

  async findByUserAndLesson(userId: number, lessonId: number) {
    const progress = await this.progressRepo.findOne({
      where: { user: { id: userId }, lesson: { id: lessonId } },
      relations: ['lesson'],
    });

    if (!progress)
      throw new NotFoundException(['No progress found for this lesson']);

    return {
      message: ['Lesson progress retrieved successfully'],
      ...progress,
      started_at: toVietnamTime(progress.started_at),
      completed_at: toVietnamTime(progress.completed_at),
    };
  }
}
