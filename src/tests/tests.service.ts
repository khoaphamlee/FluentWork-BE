import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';
import { User } from '../users/entities/user.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { TestTemplatesService } from 'src/test-templates/test-templates.service';
  
@Injectable()
export class TestsService {
    constructor(
        @InjectRepository(Test)
        private readonly testRepository: Repository<Test>,
        private readonly testTemplateService: TestTemplatesService,
    
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    
        @InjectRepository(TestTemplate)
        private readonly testTemplateRepository: Repository<TestTemplate>,

        @InjectRepository(TestQuestion)
        private readonly testQuestionRepository: Repository<TestQuestion>,
    ) {}
  
    async create(dto: CreateTestDto): Promise<Test> {
        const user = await this.userRepository.findOneBy({ id: dto.userId });
        if (!user) throw new NotFoundException('User not found');
      
        // Tìm hoặc tạo TestTemplate tương ứng
        let templateQuery = this.testTemplateRepository.createQueryBuilder('template')
          .where('template.level = :level', { level: dto.level })
          .andWhere('template.topic = :topic', { topic: dto.topic });
      
        if (dto.vocabulary_topic && dto.vocabulary_topic.length > 0) {
          templateQuery.andWhere('template.vocabulary_topic::text = :vocabulary', {
            vocabulary: JSON.stringify(dto.vocabulary_topic),
          });
        }
      
        if (dto.grammar_topic && dto.grammar_topic.length > 0) {
          templateQuery.andWhere('template.grammar_topic::text = :grammar', {
            grammar: JSON.stringify(dto.grammar_topic),
          });
        }
      
        let template = await templateQuery.getOne();
      
        const { title, description } = this.generateTemplateInfo(dto.level, dto.topic);
        if (!template) {
          template = this.testTemplateRepository.create({
            level: dto.level,
            topic: dto.topic,
            vocabulary_topic: dto.vocabulary_topic,
            grammar_topic: dto.grammar_topic,
            title,
            description,
          });
          await this.testTemplateRepository.save(template);
        }
      
        // Tạo bài test mới
        const test = this.testRepository.create({
            user: { id: user.id }, // Truyền ID của user thay vì object user
            //testTemplate: { id: template.id },
            score: 0,
            duration: dto.duration,
            test_date: dto.test_date ?? new Date(),
            total_correct_answer: 0,
        });

        console.log(test);
        await this.testRepository.save(test);
      
        // Lấy danh sách câu hỏi phù hợp từ template
        const questions = await this.testTemplateService.getTestQuestionsByTemplate(template.id);
      
        const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
      
        // Lưu test_question (giả sử bạn có TestQuestion entity)
        for (const question of selectedQuestions) {
          await this.testQuestionRepository.save({
            test: test,
            question: question,
          });
        }
      
        return test;
      }
      
      
    async findAll(): Promise<Test[]> {
        return await this.testRepository.find({ relations: ['user'] });
    }
  
    async findAllQuestion(): Promise<Test[]> {
        return await this.testRepository.find({ relations: ['user'] });
    }
  
    async findOne(id: number): Promise<Test> {
        if (typeof id !== 'number' || isNaN(id) || id <= 0) {
            throw new BadRequestException(`Invalid ID provided: ${id}`);
        }
    
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
        const test = await this.testRepository.findOne({
          where: { id },
          relations: ['user', 'testTemplate'],
        });
      
        if (!test) {
          throw new NotFoundException(`Test with id ${id} not found`);
        }
      
        if (updateTestDto.userId) {
          const user = await this.userRepository.findOneBy({ id: updateTestDto.userId });
          if (!user) throw new NotFoundException('User not found');
          test.user = user;
        }
      
        if (updateTestDto.testTemplateId) {
          const template = await this.testTemplateRepository.findOneBy({ id: updateTestDto.testTemplateId });
          if (!template) throw new NotFoundException('Test template not found');
          test.testTemplate = template;
        }
      
        const {
          score,
          duration,
          test_date,
          total_correct_answer,
          total_incorrect_answer,
        } = updateTestDto;
      
        if (score !== undefined) test.score = score;
        if (duration) test.duration = duration;
        if (test_date) test.test_date = test_date;
        if (total_correct_answer !== undefined) test.total_correct_answer = total_correct_answer;
        if (total_incorrect_answer !== undefined) test.total_incorrect_answer = total_incorrect_answer;
      
        return await this.testRepository.save(test);
      }
      
  
    async remove(id: number): Promise<{ message: string }> {
        const result = await this.testRepository.delete(id);
    
        if (result.affected === 0) {
            throw new NotFoundException(`Test with id ${id} not found`);
        }
    
        return { message: `Test with id ${id} has been successfully deleted` };
    }
  
    async getTemplateWithQuestions(
        testTemplateId: number,
    ): Promise<TestTemplate> {
        const template = await this.testTemplateRepository.findOne({
            where: { id: testTemplateId },
            relations: ['questions', 'questions.question'],
        });
    
        if (!template) {
            throw new NotFoundException(
            `Test Template with id ${testTemplateId} not found`,
            );
        }
    
        return template;
    }

    private getRandomSubset<T>(arr: T[], count: number): T[] {
        return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
    }
      
    private generateTemplateInfo(level: string, topic: string) {
        const title = `${level} ${topic} Test`;
        const description = `This is a ${topic.toLowerCase()} test designed for ${level.toLowerCase()} learners.`;
        return { title, description };
    }
      
  }
  