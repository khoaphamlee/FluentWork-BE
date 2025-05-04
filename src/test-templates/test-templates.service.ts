import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestTemplate } from './entities/test-template.entity';
import { CreateTestTemplateDto } from './dto/create-test-template.dto';
import { UpdateTestTemplateDto } from './dto/update-test-template.dto';
import { Question } from 'src/questions/entities/question.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';

@Injectable()
export class TestTemplatesService {
    constructor(
        @InjectRepository(TestTemplate)
        private readonly testTemplateRepository: Repository<TestTemplate>,

        @InjectRepository(TestQuestion)
        private readonly testQuestionRepository: Repository<TestQuestion>,

        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
    ) {}

    async create(createDto: CreateTestTemplateDto): Promise<TestTemplate> {
        if (createDto.topic === "Mixed") {
            if (!createDto.vocabulary_topic || !createDto.grammar_topic) {
                throw new BadRequestException("Both vocabulary_topic and grammar_topic must be provided");
            }
        }
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

    async getTemplateWithQuestions(testTemplateId: number): Promise<TestTemplate> {
        const template = await this.testTemplateRepository.findOne({
        where: { id: testTemplateId, is_active: true }, 
        relations: ['questions', 'questions.question'],
        });

        if (!template) {
        throw new NotFoundException(`Test Template with id ${testTemplateId} not found or inactive`);
        }

        return template;
    }
  
    async getTestQuestionsByTemplate(id: number) {
        const testTemplate = await this.testTemplateRepository.findOne({
            where: { id },
            relations: ['questions'],
        });

        if (!testTemplate) {
            throw new Error('Test template not found');
        }

        const query = this.questionRepository
            .createQueryBuilder('question')
            .where('1=1');

        query.andWhere('question.level = :level', { level: testTemplate.level });
        
        if (testTemplate.topic === 'Mixed') {
            if (testTemplate.vocabulary_topic && testTemplate.vocabulary_topic.length > 0) {
                query.andWhere('question.vocabulary_topic IN (:...vocabularyTopics)', {
                    vocabularyTopics: testTemplate.vocabulary_topic,
                });
            }

            if (testTemplate.grammar_topic && testTemplate.grammar_topic.length > 0) {
                query.andWhere('question.grammar_topic IN (:...grammarTopics)', {
                    grammarTopics: testTemplate.grammar_topic,
                });
            }
        } else {
            if (testTemplate.topic === 'Vocabulary' && testTemplate.vocabulary_topic) {
                query.andWhere('question.vocabulary_topic IN (:...vocabularyTopics)', {
                    vocabularyTopics: testTemplate.vocabulary_topic,
                });
            }

            if (testTemplate.topic === 'Grammar' && testTemplate.grammar_topic) {
                query.andWhere('question.grammar_topic IN (:...grammarTopics)', {
                    grammarTopics: testTemplate.grammar_topic,
                });
            }
        }

        const questions = await query.getMany();

        return questions;
    }


  
}
