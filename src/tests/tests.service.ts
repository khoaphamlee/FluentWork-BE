import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';
import { User } from '../users/entities/user.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { TestTemplatesService } from 'src/test-templates/test-templates.service';
import { Question } from 'src/questions/entities/question.entity';
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

  async create(user: User, dto: CreateTestDto): Promise<Test> {
    const { type, vocabulary_topic, grammar_topic } = dto;

    if (type === 'Vocabulary') {
        if (grammar_topic?.length) {
        throw new BadRequestException('grammar_topic phải rỗng khi type là Vocabulary');
        }
        dto.grammar_topic = null;
    } else if (type === 'Grammar') {
        if (vocabulary_topic?.length) {
        throw new BadRequestException('vocabulary_topic phải rỗng khi type là Grammar');
        }
        dto.vocabulary_topic = null;
    } else if (type === 'Mixed') {
        if (!vocabulary_topic?.length || !grammar_topic?.length) {
        throw new BadRequestException(
            'Cả vocabulary_topic và grammar_topic đều bắt buộc khi type là Mixed',
        );
        }
    }

    let template = await this.findOrCreateTemplate(dto);

    const test = this.testRepository.create({
        user: { id: user.id },
        testTemplate: template,
        score: 0,
        level: dto.level as Level,
        duration: dto.duration,
        test_date: dto.test_date ?? new Date(),
        total_correct_answer: 0,
    });

    await this.testRepository.save(test);

    const questions =
        await this.testTemplateService.getQuestionsByTemplate(
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


  private async findOrCreateTemplate(dto: CreateTestDto): Promise<TestTemplate> {
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
    templateQuery.andWhere(
      `template.vocabulary_topic::text[] @> :vocabulary AND :vocabulary @> template.vocabulary_topic::text[]`,
      { vocabulary: sortedVocabulary },
    );
  } else {
    templateQuery.andWhere('template.vocabulary_topic IS NULL');
  }

  if (sortedGrammar?.length) {
    templateQuery.andWhere(
      `template.grammar_topic::text[] @> :grammar AND :grammar @> template.grammar_topic::text[]`,
      { grammar: sortedGrammar },
    );
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

  const vocabArrayString = `{${allVocabulary.join(',')}}`;
  const grammarArrayString = `{${allGrammar.join(',')}}`;

  const existing = await this.testTemplateRepository
    .createQueryBuilder('template')
    .where('template.level = :level', { level: 'All' })
    .andWhere('template.type = :type', { type: 'Mixed' })
    .andWhere('template.vocabulary_topic = :vocab', { vocab: vocabArrayString })
    .andWhere('template.grammar_topic = :grammar', { grammar: grammarArrayString })
    .getOne();

  if (existing) {
    console.log('📌 Found existing template ID:', existing.id);
    return existing;
  }

  const { title, description } = this.generateTemplateInfo('All', 'Mixed');

  const template = this.testTemplateRepository.create({
    level: 'All',
    type: 'Mixed',
    vocabulary_topic: allVocabulary,
    grammar_topic: allGrammar,
    title,
    description,
  });

  const savedTemplate = await this.testTemplateRepository.save(template);
  console.log('🆕 Created new template ID:', savedTemplate.id);
  return savedTemplate;
}

async createPlacementTest(user: User, dto: CreatePlacementTestDto): Promise<Test> {
  // 1. Kiểm tra người dùng
  const fullUser = await this.userRepository.findOneBy({ id: user.id });
  if (!fullUser) throw new Error('User not found');
  console.log('👤 Full user ID:', fullUser.id, '| Username:', fullUser.username, '| Role:', fullUser.role);

  let learnerProfile = await this.learnerProfileRepository.findOne({
        where: { user: { id: user.id } },
        relations: ['user'],
    });

    if (!learnerProfile) {
        const fullUserWithRelation = await this.userRepository.findOne({
            where: { id: user.id },
    });

    if (!fullUserWithRelation) {
        throw new NotFoundException('User not found when creating learner profile');
    }

    learnerProfile = this.learnerProfileRepository.create({
        user: fullUserWithRelation,
    });

    learnerProfile.hasCreatedPlacement = true;

    await this.learnerProfileRepository.save(learnerProfile);
    } else {
    learnerProfile.hasCreatedPlacement = true;
    await this.learnerProfileRepository.save(learnerProfile);
    }
    
  // 2. Tạo hoặc lấy template
  const template = await this.createPlacementTemplate();
  console.log('📋 Using template ID:', template.id);

  // 3. Kiểm tra nếu user đã có test với template này
  const existingTest = await this.testRepository.findOne({
    where: {
      user: { id: fullUser.id },
      testTemplate: { id: template.id },
    },
    relations: ['testTemplate', 'user'],
  });

  if (existingTest) {
    console.log('⚠️ User already has a placement test. Returning existing test.');
    console.log('📌 Existing Test ID:', existingTest.id, '| Template ID:', existingTest.testTemplate.id, '| User ID:', existingTest.user.id);
    throw new BadRequestException('Learner has already taken the placement test.');
  }

  // 4. Tạo bài test mới
  const test = this.testRepository.create({
    level: Level.ALL,
    user: fullUser,
    testTemplate: template,
    score: 0,
    duration: dto.duration,
    test_date: dto.test_date ?? new Date(),
    total_correct_answer: dto.total_correct_answers ?? 0,
    total_incorrect_answer: dto.total_incorrect_answers ?? 0,
  });
  await this.testRepository.save(test);
  console.log('✅ Created new test ID:', test.id);
  console.log('🔗 Linked to template ID:', test.testTemplate?.id, '| User ID:', test.user.id);

  // ✅ Kiểm tra hoặc tạo LearnerProfile
    

  // 5. Lấy câu hỏi phù hợp
  const questions = await this.testTemplateService.getPlacementTestQuestions(template.id);
  console.log('📚 Retrieved', questions.length, 'questions');

  // 6. Gắn câu hỏi vào test
  const testQuestions = questions.map((question) =>
    this.testQuestionRepository.create({
      test,
      question,
    }),
  );
  await this.testQuestionRepository.save(testQuestions);
  console.log('📝 Saved', testQuestions.length, 'test questions');

  // 7. Load đầy đủ quan hệ để trả về
  const created = await this.testRepository.findOne({
    where: { id: test.id },
    relations: ['testQuestions', 'testQuestions.question', 'testTemplate'],
  });

  if (!created) throw new Error('Failed to load placement test');

  console.log('🎉 Placement test creation completed for user ID:', user.id);
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

  const { userId, testTemplateId, ...rest } = updateTestDto;

  if (userId) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    test.user = user;
  }

  if (testTemplateId) {
    const template = await this.testTemplateRepository.findOneBy({ id: testTemplateId });
    if (!template) throw new NotFoundException('Test template not found');
    test.testTemplate = template;
  }

  // Gán các trường còn lại
  Object.assign(test, rest);

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
  dto: SubmitTestDto,
  userId: number,
) {
  const test = await this.testRepository.findOne({
    where: { id: testId },
    relations: ['testQuestions', 'user'],
  });

  if (!test) {
    throw new NotFoundException('Test not found');
  }

  if (test.user.id !== userId) {
    throw new ForbiddenException('You are not allowed to submit this test');
  }

  let correctCount = 0;

  for (const answerDto of dto.answers) {
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
    where: { user: { id: userId } },
    relations: ['user'],
  });

  if (!learnerProfile) {
    throw new NotFoundException('Learner profile not found');
  }

  // Truy vấn lại bài test kèm đầy đủ thông tin như placement test
  const detailedTest = await this.testRepository.findOne({
    where: { id: testId },
    relations: [
      'testQuestions',
      'testQuestions.question',
      'testQuestions.question.options',
      'testQuestions.answer',
      'testQuestions.answer.option',
    ],
  });

  if (!detailedTest) {
    throw new NotFoundException('Test not found after submission');
  }

  const totalQuestions = detailedTest.testQuestions.length;
  const score = correctCount;

  const questionsWithAnswers = detailedTest.testQuestions.map((testQuestion) => ({
    questionId: testQuestion.question.id,
    questionText: testQuestion.question.question_text,
    options: testQuestion.question.options.map((opt) => ({
        id: opt.id,
        text: opt.option_text,
        isCorrect: opt.is_correct,
    })),
    answers: testQuestion.answer.map((ans) => ({
        selectedOptionId: ans.option?.id || null,
        isCorrect: ans.option?.is_correct || false,
        answeredAt: ans.answeredAt,
    })),
    explanation: testQuestion.question.explanation,
    }));


  return {
    message: 'Test submitted successfully',
    score,
    correctAnswers: correctCount,
    totalQuestions,
    questions: questionsWithAnswers,
  };
}


  async submitCurrentTest(
  userId: number,
  dto: SubmitTestDto,
) {
  // 1. Tìm bài test gần nhất không phải placement
  const currentTest = await this.testRepository.findOne({
    where: {
      user: { id: userId },
      testTemplate: {
        type: Not('Mixed'),
        level: Not('All'),
      },
    },
    relations: ['testTemplate', 'user'],
    order: {
      test_date: 'DESC',
    },
  });

  if (!currentTest) {
    throw new NotFoundException('No current regular test found for user.');
  }

  // 2. Gọi submitTest() và return trực tiếp
  return this.submitTest(currentTest.id, dto, userId);
}

  async submitPlacementTest(
  testId: number,
  dto: SubmitTestDto,
  userId: number,
) {
  const test = await this.testRepository.findOne({
    where: { id: testId },
    relations: ['user', 'testQuestions', 'testQuestions.question'],
  });

  if (!test) throw new NotFoundException('Test not found');
  if (test.user.id !== userId)
    throw new BadRequestException('User does not own this test');

  const submittedAnswers = await Promise.all(
    dto.answers.map(async ({ testQuestionId, selectedOptionId }) => {
      const [testQuestion, option] = await Promise.all([
        this.testQuestionRepository.findOne({
          where: { id: testQuestionId },
          relations: ['question'],
        }),
        this.optionRepository.findOne({ where: { id: selectedOptionId } }),
      ]);

      return testQuestion && option
        ? this.testAnswerRepository.save({ testQuestion, option })
        : null;
    }),
  );

  const correctAnswers = submittedAnswers.filter(
    (a) => a?.option.is_correct,
  ).length;

  Object.assign(test, {
    score: correctAnswers,
    total_correct_answer: correctAnswers,
    total_incorrect_answer: test.testQuestions.length - correctAnswers,
    is_submitted: true,
  });

  await this.testRepository.save(test);

  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  let learnerProfile =
    (await this.learnerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    })) ?? this.learnerProfileRepository.create({ user });

  learnerProfile.level =
    correctAnswers >= 9
      ? Level.ADVANCED
      : correctAnswers >= 7
      ? Level.INTERMEDIATE
      : Level.BEGINNER;

  learnerProfile.hasSubmittedPlacement = true;
  await this.learnerProfileRepository.save(learnerProfile);

  const detailedTest = await this.testRepository.findOne({
    where: { id: test.id },
    relations: [
      'testQuestions',
      'testQuestions.question',
      'testQuestions.question.options',
      'testQuestions.answer',
      'testQuestions.answer.option',
    ],
  });

  if (!detailedTest) throw new NotFoundException('Test not found');

  const questionsWithAnswers = detailedTest.testQuestions.map(
    ({ question, answer }) => {
        const latestAnswer = answer?.[answer.length - 1]; // hoặc tùy theo logic chọn answer nào

        return {
        questionId: question.id,
        questionText: question.question_text,
        options: question.options.map(({ id, option_text, is_correct }) => ({
            id,
            text: option_text,
            isCorrect: is_correct,
        })),
        selectedOptionId: latestAnswer?.option?.id ?? null,
        isCorrect: latestAnswer?.option?.is_correct ?? false,
        explanation: question.explanation,
        };
    }
    );


  return {
    message: 'Placement test submitted and level assigned.',
    score: correctAnswers,
    level: learnerProfile.level,
    questions: questionsWithAnswers,
  };
}


  async submitCurrentPlacementTest(userId: number, dto: SubmitTestDto) {
  // Tìm bài test gần nhất dạng placement
  const currentPlacementTest = await this.testRepository.findOne({
    where: {
      user: { id: userId },
      testTemplate: { type: 'Mixed' },
    },
    relations: ['testTemplate', 'user'],
    order: {
      test_date: 'DESC', // hoặc createdAt nếu có
    },
  });

  if (!currentPlacementTest)
    throw new NotFoundException('No current placement test found for user.');

  return this.submitPlacementTest(currentPlacementTest.id, dto, userId);
}

  async getPlacementTestForUser(userId: number) {
  if (!userId) {
    throw new NotFoundException(`User ${userId} does not found`);
  }

  const placementTest = await this.testRepository
    .createQueryBuilder('test')
    .leftJoinAndSelect('test.testTemplate', 'testTemplate')
    .leftJoinAndSelect('test.testQuestions', 'testQuestions')
    .leftJoinAndSelect('testQuestions.question', 'question')
    .leftJoinAndSelect('question.options', 'options')
    .leftJoinAndSelect('testQuestions.answer', 'answer') // ✅ Join câu trả lời
    .leftJoinAndSelect('answer.option', 'selectedOption') // ✅ Join đáp án được chọn
    .where('test.user = :userId', { userId })
    .andWhere('testTemplate.type = :type', { type: 'Mixed' })
    .andWhere('testTemplate.level = :level', { level: 'All' })
    .orderBy('test.test_date', 'DESC')
    .getOne();

  if (!placementTest) {
    throw new NotFoundException(`User ${userId} does not have a placement test`);
  }

  // Sắp xếp câu hỏi theo thứ tự ID
  placementTest.testQuestions.sort((a, b) => a.id - b.id);

  // Chuẩn bị danh sách câu hỏi
  const questions = placementTest.testQuestions.map((tq) => ({
    questionId: tq.question.id,
    questionText: tq.question.question_text,
    explanation: tq.question.explanation,
    options: tq.question.options.map((opt) => ({
        id: opt.id,
        text: opt.option_text,
        isCorrect: opt.is_correct,
    })),
    answers: tq.answer?.map((ans) => ({
        selectedOptionId: ans.option?.id || null,
        isCorrect: ans.is_correct,
        answeredAt: ans.answeredAt,
    })) || [], // Nếu chưa có câu trả lời nào
    }));


  // Trả về chi tiết bài kiểm tra
  return {
    testId: placementTest.id,
    testDate: placementTest.test_date,
    score: placementTest.score,
    isSubmitted: placementTest.is_submitted,
    level: placementTest.level,
    duration: placementTest.duration,
    template: placementTest.testTemplate,
    questions,
  };
}


async getTestForUser(userId: number) {
  if (!userId) {
    throw new NotFoundException(`User ${userId} not found`);
  }

  const test = await this.testRepository
    .createQueryBuilder('test')
    .leftJoinAndSelect('test.testTemplate', 'testTemplate')
    .leftJoinAndSelect('test.testQuestions', 'testQuestions')
    .leftJoinAndSelect('testQuestions.question', 'question')
    .leftJoinAndSelect('question.options', 'options')
    .leftJoinAndSelect('testQuestions.answer', 'answer')
    .leftJoinAndSelect('answer.option', 'selectedOption')
    .leftJoinAndSelect('test.testMistakes', 'testMistakes')
    .where('test.user = :userId', { userId })
    .andWhere(
      `NOT (testTemplate.type = :type AND testTemplate.level = :level)`,
      { type: 'Mixed', level: 'All' },
    )
    .orderBy('test.test_date', 'DESC')
    .getOne();

  if (!test) {
    throw new NotFoundException(`User ${userId} does not have a regular test`);
  }

  test.testQuestions.sort((a, b) => a.id - b.id);

  const template = test.testTemplate;
  const duration = test.duration;

  const questions = test.testQuestions.map((tq) => ({
    questionId: tq.question.id,
    questionText: tq.question.question_text,
    explanation: tq.question.explanation,
    options: tq.question.options.map((opt) => ({
        id: opt.id,
        text: opt.option_text,
        isCorrect: opt.is_correct,
    })),
    answers: tq.answer?.map((ans) => ({
        selectedOptionId: ans.option?.id || null,
        isCorrect: ans.is_correct,
        answeredAt: ans.answeredAt,
    })) || [], // Nếu chưa có câu trả lời nào
    }));


  return {
    testId: test.id,
    testDate: test.test_date,
    score: test.score,
    isSubmitted: test.is_submitted,
    level: test.level,
    duration: duration,
    template: template,
    questions,
  };
}


}
