import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';
import { User } from '../users/entities/user.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { TestTemplatesService } from 'src/test-templates/test-templates.service';
import { Question } from 'src/questions/entities/question.entity'; // Import Question entity
import { Level } from 'src/enum/level.enum';
import { LearnerProfile } from 'src/learner-profiles/entities/learner-profile.entity';
import { TestAnswer } from 'src/test-answers/entities/test-answer.entity';
import { Option } from 'src/options/entities/option.entity';
import { SubmitTestDto } from './dto/submit-test.dto';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { CreatePlacementTestDto } from './dto/create-placement-test.dto';

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

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(TestAnswer)
    private readonly testAnswerRepository: Repository<TestAnswer>,

    @InjectRepository(LearnerProfile)
    private readonly learnerProfileRepository: Repository<LearnerProfile>,

    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
  ) {}

  async create(dto: CreateTestDto): Promise<Test> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    let template = await this.findOrCreateTemplate(dto);

    const test = this.testRepository.create({
      user: { id: user.id },
      testTemplate: template,
      score: 0,
      duration: dto.duration,
      test_date: dto.test_date ?? new Date(),
      total_correct_answer: 0,
    });

    await this.testRepository.save(test);

    const questions =
      await this.testTemplateService.getFilteredQuestionsForTemplate(
        template.id,
      );
    const selectedQuestions = this.getRandomSubset(questions, 10);

    const testQuestions = selectedQuestions.map((question) =>
      this.testQuestionRepository.create({
        test: test,
        question: question,
      }),
    );
    await this.testQuestionRepository.save(testQuestions);

    const createdTest = await this.testRepository.findOne({
      where: { id: test.id },
      relations: ['testQuestions', 'testQuestions.question'],
    });

    if (!createdTest) {
      throw new Error('Failed to retrieve the created test.');
    }
    return test;
  }

  private async findOrCreateTemplate(
    dto: CreateTestDto,
  ): Promise<TestTemplate> {
    const sortedVocabulary = dto.vocabulary_topic
      ? [...dto.vocabulary_topic].sort()
      : null;
    const sortedGrammar = dto.grammar_topic
      ? [...dto.grammar_topic].sort()
      : null;

    let templateQuery = this.testTemplateRepository
      .createQueryBuilder('template')
      .where('template.level = :level', { level: dto.level })
      .andWhere('template.type = :type', { type: dto.type });

    if (sortedVocabulary?.length) {
      templateQuery.andWhere('template.vocabulary_topic = :vocabulary', {
        vocabulary: `{${sortedVocabulary.join(',')}}`,
      });
    } else {
      templateQuery.andWhere('template.vocabulary_topic IS NULL');
    }

    if (sortedGrammar?.length) {
      templateQuery.andWhere('template.grammar_topic = :grammar', {
        grammar: `{${sortedGrammar.join(',')}}`,
      });
    } else {
      templateQuery.andWhere('template.grammar_topic IS NULL');
    }

    let template = await templateQuery.getOne();

    if (!template) {
      const { title, description } = this.generateTemplateInfo(
        dto.level,
        dto.type,
      );
      template = this.testTemplateRepository.create({
        level: dto.level,
        type: dto.type,
        vocabulary_topic: sortedVocabulary,
        grammar_topic: sortedGrammar,
        title,
        description,
      });
      await this.testTemplateRepository.save(template);
    }

    return template;
  }

  private async createPlacementTemplate(): Promise<TestTemplate> {
  const allVocabulary = Object.values(VocabularyTopic).sort();
  const allGrammar = Object.values(GrammarTopic).sort();

  const templateQuery = this.testTemplateRepository
    .createQueryBuilder('template')
    .where('template.level = :level', { level: 'All' })
    .andWhere('template.type = :type', { type: 'Mixed' })
    .andWhere('template.vocabulary_topic = :vocabulary', {
      vocabulary: `{${allVocabulary.join(',')}}`,
    })
    .andWhere('template.grammar_topic = :grammar', {
      grammar: `{${allGrammar.join(',')}}`,
    });

  let template = await templateQuery.getOne();

  if (!template) {
    const { title, description } = this.generateTemplateInfo('All', 'Mixed');
    template = this.testTemplateRepository.create({
      level: 'All',
      type: 'Mixed',
      vocabulary_topic: allVocabulary,
      grammar_topic: allGrammar,
      title,
      description,
    });
    await this.testTemplateRepository.save(template);
  }

  return template;
}

  async createPlacementTest(user: User, dto: CreatePlacementTestDto): Promise<Test> {
  const template = await this.createPlacementTemplate();

  const test = this.testRepository.create({
    level: Level.ALL,
    user: { id: user.id },
    testTemplate: template,
    score: 0,
    duration: dto.duration,
    test_date: dto.test_date ?? new Date(),
    total_correct_answer: dto.total_correct_answers ?? 0,
    total_incorrect_answer: dto.total_incorrect_answers ?? 0,
  });
  await this.testRepository.save(test);

  const questions = await this.testTemplateService.getPlacementTestQuestions(template.id);

  const testQuestions = questions.map((question) =>
    this.testQuestionRepository.create({
      test,
      question,
    }),
  );
  await this.testQuestionRepository.save(testQuestions);

  const created = await this.testRepository.findOne({
    where: { id: test.id },
    relations: ['testQuestions', 'testQuestions.question'],
  });

  if (!created) throw new Error('Failed to load placement test');

  return created;
}


  async findAll(): Promise<Test[]> {
    return await this.testRepository.find({
      relations: ['user', 'testQuestions', 'testQuestions.question'],
    });
  }

  async findOne(id: number): Promise<Test> {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new BadRequestException(`Invalid ID provided: ${id}`);
    }

    const test = await this.testRepository.findOne({
      where: { id },
      relations: ['user', 'testQuestions', 'testQuestions.question'],
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
      const user = await this.userRepository.findOneBy({
        id: updateTestDto.userId,
      });
      if (!user) throw new NotFoundException('User not found');
      test.user = user;
    }

    if (updateTestDto.testTemplateId) {
      const template = await this.testTemplateRepository.findOneBy({
        id: updateTestDto.testTemplateId,
      });
      if (!template) throw new NotFoundException('Test template not found');
      test.testTemplate = template;
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

  private getRandomSubset<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private generateTemplateInfo(level: string, topic: string) {
    const title = `${level} ${topic} Test`;
    const description = `This is a ${topic.toLowerCase()} test designed for ${level.toLowerCase()} learners.`;
    return { title, description };
  }

  async getQuestions(testId: number): Promise<Question[]> {
    const test = await this.testRepository.findOne({
      where: { id: testId },
      relations: ['testQuestions', 'testQuestions.question'],
    });

    if (!test) {
      throw new NotFoundException(`Test with id ${testId} not found`);
    }

    return test.testQuestions.map((tq) => tq.question);
  }

  async submitTest(
    testId: number,
    answers: { testQuestionId: number; selectedOptionId: number }[],
    user: User,
  ) {
    const test = await this.testRepository.findOne({
      where: { id: testId },
      relations: ['testQuestions', 'user'],
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    if (test.user.id !== user.id) {
      throw new ForbiddenException('You are not allowed to submit this test');
    }

    let correctCount = 0;

    for (const answerDto of answers) {
      const testQuestion = await this.testQuestionRepository.findOne({
        where: { id: answerDto.testQuestionId },
        relations: ['question'],
      });

      if (!testQuestion) {
        throw new NotFoundException(
          `TestQuestion ${answerDto.testQuestionId} not found`,
        );
      }

      const option = await this.optionRepository.findOne({
        where: { id: answerDto.selectedOptionId },
      });

      if (!option) {
        throw new NotFoundException(
          `Option ${answerDto.selectedOptionId} not found`,
        );
      }

      const isCorrect = option.is_correct;

      await this.testAnswerRepository.save({
        testQuestion,
        option,
        is_correct: isCorrect,
      });

      if (isCorrect) {
        correctCount++;
      }
    }

    const learnerProfile = await this.learnerProfileRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: ['user'], // nếu cần lấy thêm thông tin user
    });

    if (!learnerProfile) {
      throw new NotFoundException('Learner profile not found');
    }

    const totalQuestions = test.testQuestions.length;
    const score = correctCount / totalQuestions;

    if (score >= 0.7) {
      if (learnerProfile.level === Level.BEGINNER) {
        learnerProfile.level = Level.INTERMEDIATE;
      } else if (learnerProfile.level === Level.INTERMEDIATE) {
        learnerProfile.level = Level.ADVANCED;
      }
      await this.learnerProfileRepository.save(learnerProfile);
    }

    const submittedAnswers = await this.testAnswerRepository.find({
      where: {
        testQuestion: In(test.testQuestions.map((q) => q.id)),
      },
      relations: ['testQuestion', 'option'],
    });

    return {
      message: 'Test submitted successfully',
      correctAnswers: correctCount,
      totalQuestions,
      updatedLevel: learnerProfile.level,
      answers: submittedAnswers,
    };
  }

  async submitPlacementTest(
    testId: number,
    dto: SubmitTestDto,
    userId: number,
  ) {
    const test = await this.testRepository.findOne({
      where: { id: testId },
      relations: ['testQuestions', 'testQuestions.question'],
    });

    if (!test) throw new NotFoundException('Test not found');
    if (test.user.id !== userId)
      throw new BadRequestException('User does not own this test');

    const submittedAnswers = await Promise.all(
      dto.answers.map(async (answer) => {
        const testQuestion = await this.testQuestionRepository.findOne({
          where: { id: answer.testQuestionId },
          relations: ['question'],
        });

        const option = await this.optionRepository.findOne({
          where: { id: answer.selectedOptionId },
        });

        if (!testQuestion || !option) return null;

        return this.testAnswerRepository.save({
          testQuestion,
          option,
        });
      }),
    );

    const correctAnswers = submittedAnswers.filter(
      (a) => a && a.option.is_correct,
    ).length;

    test.score = correctAnswers;
    test.total_correct_answer = correctAnswers;
    test.total_incorrect_answer = test.testQuestions.length - correctAnswers;
    await this.testRepository.save(test);

    const learnerProfile = await this.learnerProfileRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'], // nếu cần lấy thêm thông tin user
    });

    if (!learnerProfile)
      throw new NotFoundException('Learner profile not found');

    if (correctAnswers >= 9) {
      learnerProfile.level = Level.ADVANCED;
    } else if (correctAnswers >= 7) {
      learnerProfile.level = Level.INTERMEDIATE;
    } else {
      learnerProfile.level = Level.BEGINNER;
    }

    await this.learnerProfileRepository.save(learnerProfile);

    return {
      message: 'Placement test submitted and level assigned.',
      score: correctAnswers,
      level: learnerProfile.level,
    };
  }

  async getPlacementTestForUser(userId: number) {
    if (!userId) {
    throw new NotFoundException(`User ${userId} does not found`);
  }
  const placementTest = await this.testRepository
    .createQueryBuilder('test')
    .leftJoinAndSelect('test.testTemplate', 'testTemplate')
    .leftJoinAndSelect('test.testQuestions', 'testQuestions')
    .leftJoinAndSelect('test.testMistakes', 'testMistakes')
    .where('test.userId = :userId', { userId })
    .andWhere('testTemplate.type = :type', { type: 'Mixed' }) // Chỉ lấy bài test tổng hợp
    .andWhere('testTemplate.level = :level', { level: 'All' }) // Cho mọi trình độ
    .getOne();

  if (!placementTest) {
    throw new NotFoundException(`User ${userId} does not have a placement test`);
  }

  return placementTest;
}




}
