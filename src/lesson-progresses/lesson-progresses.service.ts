import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';
import { LessonProgress } from './entities/lesson-progress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class LessonProgressesService {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepository: Repository<LessonProgress>,
  ) {}

  async create(createLessonProgressDto: CreateLessonProgressDto) {
    // Một user chỉ có 1 progress / lesson ⇒ kiểm tra trùng
    const duplicate = await this.lessonProgressRepository.findOne({
      where: {
        user: { id: createLessonProgressDto.userId },
        lesson: { id: createLessonProgressDto.lessonId },
      },
    });
    if (duplicate) throw new ConflictException('Progress already exists');

    const entity = this.lessonProgressRepository.create({
      ...createLessonProgressDto,
      user: { id: createLessonProgressDto.userId } as any,
      lesson: { id: createLessonProgressDto.lessonId } as any,
    });
    return this.lessonProgressRepository.save(entity);
  }

  findAll(filters: {
    userId?: number;
    lessonId?: number;
    status?: 'Not Started' | 'In Progress' | 'Completed';
  }) {
    return this.lessonProgressRepository.find({
      where: {
        ...(filters.userId && { user: { id: filters.userId } }),
        ...(filters.lessonId && { lesson: { id: filters.lessonId } }),
        ...(filters.status && { status: filters.status }),
      },
      relations: ['user', 'lesson'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number, currentUser: any) {
    const progress = await this.lessonProgressRepository.findOne({
      where: { id },
      relations: ['user', 'lesson'],
    });
    if (!progress) throw new NotFoundException('Progress not found');

    if (
      currentUser.role === UserRole.Learner &&
      progress.user.id !== currentUser.id
    ) {
      throw new ForbiddenException('Access denied');
    }
    return progress;
  }

  async update(id: number, dto: UpdateLessonProgressDto, currentUser: any) {
    const progress = await this.findOne(id, currentUser);

    // Learner chỉ chỉnh của họ
    if (
      currentUser.role === UserRole.Learner &&
      progress.user.id !== currentUser.id
    ) {
      throw new ForbiddenException('Access denied');
    }

    Object.assign(progress, dto);
    return this.lessonProgressRepository.save(progress);
  }

  async remove(id: number) {
    await this.lessonProgressRepository.delete(id);
    return { deleted: true };
  }
}
