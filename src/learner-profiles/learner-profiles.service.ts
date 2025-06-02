import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnerProfile } from './entities/learner-profile.entity';
import { CreateLearnerProfileDto } from './dto/create-learner-profile.dto';
import { UpdateLearnerProfileDto } from './dto/update-learner-profile.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LearnerProfilesService {
  constructor(
    @InjectRepository(LearnerProfile)
    private readonly learnerProfileRepo: Repository<LearnerProfile>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateLearnerProfileDto): Promise<LearnerProfile> {
    const user = await this.userRepo.findOneBy({ id: dto.user_id });
    if (!user) {
      throw new NotFoundException(`User  not found`);
    }

    const existingProfile = await this.learnerProfileRepo.findOne({
      where: { user: { id: dto.user_id } },
    });
    if (existingProfile) {
      throw new ConflictException(
        `LearnerProfile for this user already exists`,
      );
    }

    const profile = new LearnerProfile();
    profile.user = user;
    profile.level = dto.proficiency_level;
    profile.total_lessons_completed = dto.total_lessons_completed;

    return await this.learnerProfileRepo.save(profile);
  }

  async findAll(): Promise<LearnerProfile[]> {
    return this.learnerProfileRepo.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<LearnerProfile> {
    const profile = await this.learnerProfileRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(`LearnerProfile not found`);
    }
    return profile;
  }

  async update(
    id: number,
    dto: UpdateLearnerProfileDto,
  ): Promise<LearnerProfile> {
    const profile = await this.learnerProfileRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(`LearnerProfile not found`);
    }

    if (dto.proficiency_level) {
      profile.level = dto.proficiency_level;
    }

    if (dto.total_lessons_completed !== undefined) {
      profile.total_lessons_completed = dto.total_lessons_completed;
    }

    return this.learnerProfileRepo.save(profile);
  }

  async remove(id: number): Promise<void> {
    const result = await this.learnerProfileRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`LearnerProfile not found`);
    }
  }

  async findByUserId(userId: number) {
    const profile = await this.learnerProfileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('LearnerProfile not found');
    }

    return profile;
  }
}
