import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestMistakeDto } from './dto/create-test-mistake.dto';
import { UpdateTestMistakeDto } from './dto/update-test-mistake.dto';
import { TestMistake } from './entities/test-mistake.entity';
import { UserMistakesService } from 'src/user-mistakes/user-mistakes.service';
import { CreateUserMistakeDto } from 'src/user-mistakes/dto/create-user-mistake.dto';

@Injectable()
export class TestMistakesService {
  constructor(
    @InjectRepository(TestMistake)
    private testMistakeRepository: Repository<TestMistake>,
    private readonly userMistakesService: UserMistakesService,
  ) {}

  async create(createTestMistakeDto: CreateTestMistakeDto, userId: number) {
    const testMistake = this.testMistakeRepository.create(createTestMistakeDto);
    await this.testMistakeRepository.save(testMistake);
  
    const userMistakeDto: CreateUserMistakeDto = {
      type: createTestMistakeDto.type,
      vocabulary_topic: createTestMistakeDto.vocabulary_topic || null,
      grammar_topic: createTestMistakeDto.grammar_topic || null,
      total_mistake_count: createTestMistakeDto.mistake_count,
      last_updated: new Date(),
    };
  
    await this.userMistakesService.updateOrCreateUserMistake(userId, userMistakeDto);
  
    return testMistake;
  }
  
  async findAll(): Promise<TestMistake[]> {
    return await this.testMistakeRepository.find();
  }

  async findOne(id: number): Promise<TestMistake> {
    const testMistake = await this.testMistakeRepository.findOne({
        where: { id },
      });
      
    if (!testMistake) {
      throw new NotFoundException(`TestMistake with ID ${id} not found`);
    }
    return testMistake;
  }

  async update(id: number, updateTestMistakeDto: UpdateTestMistakeDto): Promise<TestMistake> {
    await this.testMistakeRepository.update(id, updateTestMistakeDto);
    return this.findOne(id); 
  }

  async remove(id: number): Promise<boolean> {
    const testMistake = await this.testMistakeRepository.findOne({
      where: { id },
    });

    if (!testMistake) {
      return false; 
    }

    await this.testMistakeRepository.remove(testMistake);
    return true;
  }
}
