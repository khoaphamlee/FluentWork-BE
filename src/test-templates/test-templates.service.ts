import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { TestTemplate } from './entities/test-template.entity';
import { CreateTestTemplateDto } from './dto/create-test-template.dto';
import { UpdateTestTemplateDto } from './dto/update-test-template.dto';
import { Question } from 'src/questions/entities/question.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { Level } from 'src/enum/level.enum';

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
        if (createDto.type === "Mixed") {
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
  
    async getQuestionsByTemplate(templateId: number): Promise<Question[]> {
        const template = await this.testTemplateRepository.findOne({
            where: { id: templateId },
        });

        if (!template) {
            throw new NotFoundException(`Test template with id ${templateId} not found`);
        }

        const query = this.questionRepository.createQueryBuilder('question');

        // Filter theo level nếu có
        if (template.level && template.level !== Level.ALL) {
            query.andWhere('question.level = :level', { level: template.level });
        }

        // Normalize topic thành mảng an toàn
        const vocabTopics = Array.isArray(template.vocabulary_topic)
            ? template.vocabulary_topic
            : [template.vocabulary_topic].filter(Boolean);

        const grammarTopics = Array.isArray(template.grammar_topic)
            ? template.grammar_topic
            : [template.grammar_topic].filter(Boolean);

        // Filter theo type
        if (template.type === 'Mixed') {
            if (vocabTopics.length > 0 || grammarTopics.length > 0) {
                query.andWhere(new Brackets(qb => {
                    if (vocabTopics.length > 0) {
                        qb.where('question.vocabulary_topic IN (:...vocabTopics)', { vocabTopics });
                    }
                    if (grammarTopics.length > 0) {
                        const method = vocabTopics.length > 0 ? 'orWhere' : 'where';
                        qb[method]('question.grammar_topic IN (:...grammarTopics)', { grammarTopics });
                    }
                }));
            }
        } else if (template.type === 'Vocabulary' && vocabTopics.length > 0) {
            query.andWhere('question.vocabulary_topic IN (:...vocabTopics)', { vocabTopics });
        } else if (template.type === 'Grammar' && grammarTopics.length > 0) {
            query.andWhere('question.grammar_topic IN (:...grammarTopics)', { grammarTopics });
        }

        return await query.getMany();
    }

    async getPlacementTestQuestions(templateId: number): Promise<Question[]> {
        const template = await this.testTemplateRepository.findOne({
            where: { id: templateId },
            select: ['id'],
        });

        if (!template) {
            throw new NotFoundException(`Test template with id ${templateId} not found`);
        }

        const levels = ['Beginner', 'Intermediate', 'Advanced'];
        const vocabCounts = [2, 2, 1];
        const grammarCounts = [2, 2, 1];

        const finalQuestions: Question[] = [];

        for (let i = 0; i < levels.length; i++) {
            const level = levels[i];

            const vocabQuestions = await this.questionRepository
                .createQueryBuilder('question')
                .where('question.level = :level', { level })
                .andWhere('question.type = :type', { type: 'Vocabulary' })
                .limit(vocabCounts[i])
                .orderBy('RANDOM()')
                .getMany();

            if (vocabQuestions.length < vocabCounts[i]) {
                throw new Error(
                    `Not enough vocabulary questions for level ${level}. Needed ${vocabCounts[i]}, got ${vocabQuestions.length}`
                );
            }

            const grammarQuestions = await this.questionRepository
                .createQueryBuilder('question')
                .where('question.level = :level', { level })
                .andWhere('question.type = :type', { type: 'Grammar' })
                .limit(grammarCounts[i])
                .orderBy('RANDOM()')
                .getMany();

            if (grammarQuestions.length < grammarCounts[i]) {
                throw new Error(
                    `Not enough grammar questions for level ${level}. Needed ${grammarCounts[i]}, got ${grammarQuestions.length}`
                );
            }

            finalQuestions.push(...vocabQuestions, ...grammarQuestions);
        }

        return finalQuestions;
    }

}