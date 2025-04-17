import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTestDto: CreateTestDto): Promise<Test> {
    const user = await this.userRepository.findOneBy({ id: createTestDto.user_id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const test = this.testRepository.create({
      ...createTestDto,
      user,
    });

    return await this.testRepository.save(test);
  }

  async findAll(): Promise<Test[]> {
    return await this.testRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Test> {
    const test = await this.testRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!test) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }

    return test;
  }

  async update(id: number, updateTestDto: UpdateTestDto): Promise<Test> {
    const test = await this.testRepository.findOne({ where: { id } });

    if (!test) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }

    // Nếu user_id được cập nhật
    if (updateTestDto.user_id) {
      const user = await this.userRepository.findOneBy({ id: updateTestDto.user_id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      test.user = user;
    }

    Object.assign(test, updateTestDto);

    return await this.testRepository.save(test);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.testRepository.delete(id);
  
    if (result.affected === 0) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }
  
    return { message: `Test with id ${id} has been successfully deleted` };
  }  
}
