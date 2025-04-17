import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestTemplate } from './entities/test-template.entity';
import { CreateTestTemplateDto } from './dto/create-test-template.dto';
import { UpdateTestTemplateDto } from './dto/update-test-template.dto';

@Injectable()
export class TestTemplatesService {
  constructor(
    @InjectRepository(TestTemplate)
    private readonly testTemplateRepository: Repository<TestTemplate>,
  ) {}

  async create(createDto: CreateTestTemplateDto): Promise<TestTemplate> {
    const testTemplate = this.testTemplateRepository.create(createDto);
    return await this.testTemplateRepository.save(testTemplate);
  }

  async findAll(): Promise<TestTemplate[]> {
    return await this.testTemplateRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TestTemplate> {
    const template = await this.testTemplateRepository.findOne({
      where: { id },
    });
    if (!template) throw new NotFoundException(`TestTemplate #${id} not found`);
    return template;
  }

  async update(
    id: number,
    updateDto: UpdateTestTemplateDto,
  ): Promise<TestTemplate> {
    const template = await this.findOne(id);
    const updated = this.testTemplateRepository.merge(template, updateDto);
    return await this.testTemplateRepository.save(updated);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const result = await this.testTemplateRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TestTemplate #${id} not found`);
    }
    return { deleted: true };
  }
}
