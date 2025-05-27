import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException(`User with id ${dto.user_id} not found`);
    }

    const profile = new LearnerProfile();
    profile.user = user; 
    profile.level = dto.proficiency_level;
    profile.total_lessons_completed = dto.total_lessons_completed;
    profile.last_activity_date = dto.last_activity_date ?? null;

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
      throw new NotFoundException(`LearnerProfile with id ${id} not found`);
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
      throw new NotFoundException(`LearnerProfile with id ${id} not found`);
    }

    if (dto.user_id) {
      const user = await this.userRepo.findOneBy({ id: dto.user_id });
      if (!user) {
        throw new NotFoundException(`User with id ${dto.user_id} not found`);
      }
      profile.user = user;
    }

    if (dto.proficiency_level) profile.level = dto.proficiency_level;
    if (dto.total_lessons_completed !== undefined)
      profile.total_lessons_completed = dto.total_lessons_completed;
    if (dto.last_activity_date !== undefined)
      profile.last_activity_date = dto.last_activity_date;

    return this.learnerProfileRepo.save(profile);
  }

  async remove(id: number): Promise<void> {
    const result = await this.learnerProfileRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`LearnerProfile with id ${id} not found`);
    }
  }
}
