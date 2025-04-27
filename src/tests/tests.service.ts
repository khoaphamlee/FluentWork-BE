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

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(TestTemplate)
    private readonly testTemplateRepository: Repository<TestTemplate>,
  ) {}

  async create(dto: CreateTestDto): Promise<Test> {
    const test = new Test();

    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');
    test.user = user;

    const template = await this.testTemplateRepository.findOne({
      where: { id: dto.testTemplateId },
    });
    if (!template) throw new NotFoundException('Test template not found');
    test.testTemplate = template;

    test.score = dto.score ?? 0;
    test.level = dto.proficiency_level;
    test.duration = dto.duration;
    test.test_date = dto.test_date;
    test.total_correct_answer = dto.total_correct_answers ?? 0;

    return this.testRepository.save(test);
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

    // Nếu user_id được cập nhật
    if (updateTestDto.user_id) {
      const user = await this.userRepository.findOneBy({
        id: updateTestDto.user_id,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      test.user = user;
    }

    // Nếu testTemplateId được cập nhật
    if (updateTestDto.testTemplateId) {
      const template = await this.testTemplateRepository.findOneBy({
        id: updateTestDto.testTemplateId,
      });
      if (!template) {
        throw new NotFoundException('Test template not found');
      }
      test.testTemplate = template;
    }

    // Gán các trường còn lại
    const {
      score,
      proficiency_level,
      duration,
      test_date,
      total_correct_answers,
    } = updateTestDto;

    if (score !== undefined) test.score = score;
    if (proficiency_level) test.level = proficiency_level;
    if (duration) test.duration = duration;
    if (test_date) test.test_date = test_date;
    if (total_correct_answers !== undefined)
      test.total_correct_answer = total_correct_answers;

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

  // async submitTest(dto: SubmitTestDto) {
  //   const { userId, answers } = dto;

  //   const template = await this.testTemplateRepository.findOne({
  //     where: { isDefault: true },
  //     relations: ['testQuestions', 'testQuestions.question'],
  //   });

  //   let totalCorrect = 0;

  //   for (const ans of answers) {
  //     const question = template.testQuestions.find(q => q.question.id === ans.questionId)?.question;
  //     if (question && question.correctAnswerIndex === ans.selectedOptionIndex) {
  //       totalCorrect++;
  //     }

  //     await this.testAnswerRepo.save({
  //       user: { id: userId },
  //       question: { id: ans.questionId },
  //       selectedOptionIndex: ans.selectedOptionIndex,
  //     });
  //   }

  //   const score = (totalCorrect / template.testQuestions.length) * 100;

  //   let level: 'Beginner' | 'Intermediate' | 'Advanced';
  //   if (score >= 80) level = 'Advanced';
  //   else if (score >= 50) level = 'Intermediate';
  //   else level = 'Beginner';

  //   const test = await this.testRepo.save({
  //     user: { id: userId },
  //     score,
  //     proficiency_level: level,
  //     duration: '00:20:00', // tùy tracking thời gian
  //     test_date: new Date(),
  //     total_correct_answers: totalCorrect,
  //     testTemplate: template,
  //   });

  //   return {
  //     testId: test.id,
  //     score,
  //     level,
  //     totalCorrectAnswers: totalCorrect,
  //   };
  // }

  // async getLatestResult(userId: number) {
  //   const test = await this.testRepo.findOne({
  //     where: { user: { id: userId } },
  //     order: { test_date: 'DESC' },
  //   });

  //   if (!test) {
  //     throw new NotFoundException('No test found for user');
  //   }

  //   return {
  //     testId: test.id,
  //     score: test.score,
  //     level: test.proficiency_level,
  //     totalCorrectAnswers: test.total_correct_answers,
  //     date: test.test_date,
  //   };
  // }
}
