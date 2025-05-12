import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';
import { LearningPath } from './entities/learning-path.entity';

@Injectable()
export class LearningPathsService {
  constructor(
    @InjectRepository(LearningPath)
    private learningPathRepository: Repository<LearningPath>,
  ) {}

  async create(createLearningPathDto: CreateLearningPathDto): Promise<LearningPath> {
    const newLearningPath = this.learningPathRepository.create(createLearningPathDto);
    return await this.learningPathRepository.save(newLearningPath);
  }

  async findAll(): Promise<LearningPath[]> {
    return await this.learningPathRepository.find();
  }

  async findOne(id: number): Promise<LearningPath> {
    const learningPath = await this.learningPathRepository.findOne({
      where: { id },
    });
    if (!learningPath) {
      throw new Error(`LearningPath with ID ${id} not found`);
    }
    return learningPath;
  }

  async update(id: number, updateLearningPathDto: UpdateLearningPathDto): Promise<LearningPath> {
    const learningPath = await this.findOne(id); 
    Object.assign(learningPath, updateLearningPathDto); 
    return await this.learningPathRepository.save(learningPath); 
  }

  async remove(id: number): Promise<void> {
    const learningPath = await this.findOne(id); 
    await this.learningPathRepository.remove(learningPath); 
  }
}
