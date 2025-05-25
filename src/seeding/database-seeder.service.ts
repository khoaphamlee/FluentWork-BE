import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Flashcard } from 'src/flashcards/entities/flashcard.entity';
import { Repository } from 'typeorm';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { User } from 'src/users/entities/user.entity';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';
import { Level } from 'src/enum/level.enum';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Topic } from 'src/enum/topic.enum';
import { LessonProgress } from 'src/lesson-progresses/entities/lesson-progress.entity';
import { randomInt } from 'crypto';
import toVietnamTime from 'src/common/helper/toVietnamTime';

@Injectable()
export class DatabaseSeederService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Flashcard)
    private readonly flashcardsRepository: Repository<Flashcard>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepository: Repository<LessonProgress>,
  ) {}

  async seed() {
    await this.seedAdmin();
    await this.seedLearner();
    await this.seedInstructor();

    await this.seedMockUser();

    await this.seedITFlashcards();
    await this.seedBusinessFlashcards();
    await this.seedFinanceFlashcards();

    // 🌐 FINANCE
    await this.seedVocabularyLessonsByTopicAndLevel(
      VocabularyTopic.FINANCE,
      Level.BEGINNER,
      'Beginner',
      'Learn the core vocabulary used in finance.',
      '<p>This lesson introduces basic financial terms like asset, liability, and equity.</p>',
    );

    await this.seedVocabularyLessonsByTopicAndLevel(
      VocabularyTopic.FINANCE,
      Level.INTERMEDIATE,
      'Intermediate',
      'Expand your finance vocabulary with intermediate-level terms.',
      '<p>This lesson dives deeper into finance topics such as amortization, capital gains, and portfolio.</p>',
    );

    await this.seedVocabularyLessonsByTopicAndLevel(
      VocabularyTopic.FINANCE,
      Level.ADVANCED,
      'Advanced',
      'Master advanced financial terminology and concepts.',
      '<p>This lesson covers complex terms like derivatives, hedge funds, and fiscal policy.</p>',
    );

    // 💻 INFORMATION_TECHNOLOGY
    await this.seedVocabularyLessonsByTopicAndLevel(
      VocabularyTopic.INFORMATION_TECHNOLOGY,
      Level.BEGINNER,
      'Beginner',
      'Learn the core vocabulary used in IT.',
      '<p>This lesson introduces basic IT terms like hardware, software, and server.</p>',
    );

    await this.seedVocabularyLessonsByTopicAndLevel(
      VocabularyTopic.INFORMATION_TECHNOLOGY,
      Level.INTERMEDIATE,
      'Intermediate',
      'Explore intermediate IT concepts and terminology.',
      '<p>This lesson includes terms such as database, cloud computing, and frontend/backend.</p>',
    );

    await this.seedVocabularyLessonsByTopicAndLevel(
      VocabularyTopic.INFORMATION_TECHNOLOGY,
      Level.ADVANCED,
      'Advanced',
      'Master advanced IT vocabulary and systems.',
      '<p>This lesson covers advanced IT concepts like microservices, containerization, and machine learning.</p>',
    );

    // 🏢 BUSINESS
    await this.seedVocabularyLessonsByTopicAndLevel(
      VocabularyTopic.BUSINESS,
      Level.BEGINNER,
      'Beginner',
      'Learn the core vocabulary used in business.',
      '<p>This lesson introduces basic business terms like revenue, expense, and profit.</p>',
    );

    await this.seedVocabularyLessonsByTopicAndLevel(
      VocabularyTopic.BUSINESS,
      Level.INTERMEDIATE,
      'Intermediate',
      'Expand your business vocabulary with more useful terms.',
      '<p>This lesson includes terms such as ROI, stakeholder, and supply chain.</p>',
    );

    await this.seedVocabularyLessonsByTopicAndLevel(
      VocabularyTopic.BUSINESS,
      Level.ADVANCED,
      'Advanced',
      'Master advanced business and strategic concepts.',
      '<p>This lesson covers terms like mergers, acquisitions, strategic planning, and market positioning.</p>',
    );

    await this.seedAllGrammarLessons();

    await this.seedUserLessonProgress();
  }

  async seedMockUser() {
    const existingCount = await this.usersRepository.count();
    if (existingCount >= 100) {
      console.log('ℹ️ Mock users already seeded');
      return;
    }

    for (let i = 1; i <= 100; i++) {
      const email = `user${i}@example.com`;
      const username = `user${i}`;

      const existing = await this.usersRepository.findOne({
        where: [{ email }, { username }],
      });

      if (existing) {
        console.log(`ℹ️ user${i} already exists, skipping...`);
        continue;
      }

      const role =
        i % 15 === 0
          ? UserRole.Admin
          : i % 5 === 0
            ? UserRole.Instructor
            : UserRole.Learner;

      const date = new Date(
        2025,
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 28) + 1,
      );

      const user = this.usersRepository.create({
        username,
        email,
        fullname: `User${i} Example`,
        password_hash:
          '$2b$10$KbNz.3pDGbY0tvZ7O/NF1Oo/JIz9v.QFvhHTOqnlw/KH1KMZ9iHSu', // hash cho 'password'
        role,
        created_at: date,
        updated_at: date,
      });

      await this.usersRepository.save(user);
    }

    console.log('✅ Seeded mock users (skipping duplicates)');
  }

  async seedAdmin() {
    const user = await this.usersService.findByEmail('admin@example.com');
    if (!user) {
      const password = await bcrypt.hash('admin123', 10);
      await this.usersService.create({
        username: 'admin',
        email: 'admin@example.com',
        fullname: 'Administrator',
        password: 'admin123',
        role: UserRole.Admin,
      });
      console.log('✅ Admin account seeded'); // password: admin123
    } else {
      console.log('ℹ️ Admin account already exists');
    }
  }

  async seedLearner() {
    const user = await this.usersService.findByEmail('learner@example.com');
    if (!user) {
      await this.usersService.create({
        username: 'learner',
        email: 'learner@example.com',
        fullname: 'Learner',
        password: 'learner123',
        role: UserRole.Learner,
      });
      console.log('✅ Learner account seeded'); // password: learner123
    } else {
      console.log('ℹ️ Learner account already exists');
    }
  }
  async seedInstructor() {
    const user = await this.usersService.findByEmail('instructor@example.com');
    if (!user) {
      const password = await bcrypt.hash('instructor123', 10);
      await this.usersService.create({
        username: 'instructor',
        email: 'instructor@example.com',
        fullname: 'Instructor',
        password: 'instructor123',
        role: UserRole.Instructor,
      });
      console.log('✅ Instructor account seeded'); // password: instructor123
    } else {
      console.log('ℹ️ Instructor account already exists');
    }
  }

  async seedITFlashcards() {
    const itCount = await this.flashcardsRepository.count({
      where: { topic: VocabularyTopic.INFORMATION_TECHNOLOGY },
    });

    if (itCount > 0) {
      console.log('ℹ️ IT flashcards already seeded');
      return;
    }

    const data = [
      { word: 'algorithm', definition: 'thuật toán' },
      {
        word: 'API (Application Programming Interface)',
        definition: 'giao diện lập trình ứng dụng',
      },
      { word: 'artificial intelligence', definition: 'trí tuệ nhân tạo' },
      { word: 'big data', definition: 'dữ liệu lớn' },
      { word: 'blockchain', definition: 'chuỗi khối' },
      { word: 'bug', definition: 'lỗi' },
      { word: 'cloud computing', definition: 'điện toán đám mây' },
      { word: 'cybersecurity', definition: 'an ninh mạng' },
      { word: 'data analytics', definition: 'phân tích dữ liệu' },
      { word: 'database', definition: 'cơ sở dữ liệu' },
      { word: 'debug', definition: 'gỡ lỗi' },
      { word: 'encryption', definition: 'mã hóa' },
      { word: 'firewall', definition: 'tường lửa' },
      { word: 'machine learning', definition: 'máy học' },
      { word: 'open source', definition: 'mã nguồn mở' },
      { word: 'operating system', definition: 'hệ điều hành' },
      { word: 'programmer', definition: 'lập trình viên' },
      { word: 'protocol', definition: 'giao thức' },
      { word: 'server', definition: 'máy chủ' },
      { word: 'source code', definition: 'mã nguồn' },
      { word: 'user interface', definition: 'giao diện người dùng' },
      { word: 'version control', definition: 'quản lý phiên bản' },
      { word: 'user experience', definition: 'trải nghiệm người dùng' },
      { word: 'malware', definition: 'phần mềm độc hại' },
      { word: 'phishing', definition: 'lừa đảo qua mạng' },
      { word: 'domain name', definition: 'tên miền' },
      { word: 'cache', definition: 'bộ nhớ đệm' },
      { word: 'scalability', definition: 'khả năng mở rộng' },
      { word: 'latency', definition: 'độ trễ' },
      { word: 'virtual machine', definition: 'máy ảo' },
      { word: 'bandwidth', definition: 'băng thông' },
      { word: 'virtual reality', definition: 'thực tế ảo' },
      { word: 'Internet of Things (IoT)', definition: 'Internet vạn vật' },
    ].map((f) => ({ ...f, topic: VocabularyTopic.INFORMATION_TECHNOLOGY }));

    await this.flashcardsRepository.insert(data);
    console.log(`✅ Seeded ${data.length} IT flashcards`);
  }

  async seedBusinessFlashcards() {
    const count = await this.flashcardsRepository.count({
      where: { topic: VocabularyTopic.BUSINESS },
    });

    if (count > 0) {
      console.log('ℹ️ Business flashcards already seeded');
      return;
    }

    const data = [
      { word: 'stakeholder', definition: 'bên liên quan' },
      { word: 'merger', definition: 'sáp nhập' },
      { word: 'acquisition', definition: 'mua lại doanh nghiệp' },
      { word: 'entrepreneur', definition: 'doanh nhân' },
      { word: 'startup', definition: 'công ty khởi nghiệp' },
      { word: 'market share', definition: 'thị phần' },
      { word: 'revenue', definition: 'doanh thu' },
      { word: 'profit margin', definition: 'biên lợi nhuận' },
      { word: 'Return on Investment (ROI)', definition: 'tỷ suất hoàn vốn' },
      { word: 'logistics', definition: 'hậu cần' },
      { word: 'supply chain', definition: 'chuỗi cung ứng' },
      { word: 'outsourcing', definition: 'thuê ngoài' },
      { word: 'benchmark', definition: 'điểm chuẩn' },
      {
        word: 'Key Performance Indicator (KPI)',
        definition: 'chỉ số hiệu suất chính',
      },
      { word: 'risk management', definition: 'quản trị rủi ro' },
      { word: 'brainstorming', definition: 'động não' },
      { word: 'negotiation', definition: 'đàm phán' },
      { word: 'strategy', definition: 'chiến lược' },
      {
        word: 'Chief Executive Officer (CEO)',
        definition: 'giám đốc điều hành',
      },
      { word: 'Human Resources (HR)', definition: 'nhân sự' },
      { word: 'deadline', definition: 'hạn chót' },
      { word: 'milestone', definition: 'cột mốc' },
      { word: 'innovation', definition: 'đổi mới sáng tạo' },
      { word: 'competitive advantage', definition: 'lợi thế cạnh tranh' },
      { word: 'brand identity', definition: 'nhận diện thương hiệu' },
      { word: 'market segment', definition: 'phân khúc thị trường' },
      { word: 'project management', definition: 'quản lý dự án' },
      { word: 'business model', definition: 'mô hình kinh doanh' },
      { word: 'market research', definition: 'nghiên cứu thị trường' },
      { word: 'corporate culture', definition: 'văn hóa doanh nghiệp' },
      { word: 'business ethics', definition: 'đạo đức kinh doanh' },
      { word: 'diversification', definition: 'đa dạng hóa' },
      { word: 'economies of scale', definition: 'lợi thế kinh tế theo quy mô' },
    ].map((f) => ({ ...f, topic: VocabularyTopic.BUSINESS }));

    await this.flashcardsRepository.insert(data);
    console.log(`✅ Seeded ${data.length} Business flashcards`);
  }

  async seedFinanceFlashcards() {
    const count = await this.flashcardsRepository.count({
      where: { topic: VocabularyTopic.FINANCE },
    });

    if (count > 0) {
      console.log('ℹ️ Finance flashcards already seeded');
      return;
    }

    const data = [
      { word: 'asset', definition: 'tài sản' },
      { word: 'liability', definition: 'nợ phải trả' },
      { word: 'equity', definition: 'vốn chủ sở hữu' },
      { word: 'capital', definition: 'vốn' },
      { word: 'interest rate', definition: 'lãi suất' },
      { word: 'inflation', definition: 'lạm phát' },
      { word: 'stock', definition: 'cổ phiếu' },
      { word: 'bond', definition: 'trái phiếu' },
      { word: 'shareholder', definition: 'cổ đông' },
      { word: 'dividend', definition: 'cổ tức' },
      { word: 'balance sheet', definition: 'bảng cân đối kế toán' },
      { word: 'exchange rate', definition: 'tỷ giá hối đoái' },
      {
        word: 'Gross Domestic Product (GDP)',
        definition: 'tổng sản phẩm quốc nội',
      },
      {
        word: 'Initial Public Offering (IPO)',
        definition: 'phát hành cổ phiếu lần đầu ra công chúng',
      },
      { word: 'market capitalization', definition: 'vốn hóa thị trường' },
      { word: 'volatility', definition: 'độ biến động' },
      { word: 'liquidity', definition: 'thanh khoản' },
      { word: 'yield', definition: 'lợi suất' },
      { word: 'portfolio', definition: 'danh mục đầu tư' },
      { word: 'mutual fund', definition: 'quỹ tương hỗ' },
      { word: 'recession', definition: 'suy thoái kinh tế' },
      { word: 'depreciation', definition: 'khấu hao' },
      { word: 'cryptocurrency', definition: 'tiền mã hóa' },
      { word: 'fiscal year', definition: 'năm tài chính' },
      { word: 'break-even point', definition: 'điểm hòa vốn' },
      { word: 'audit', definition: 'kiểm toán' },
      { word: 'Value Added Tax (VAT)', definition: 'thuế giá trị gia tăng' },
      { word: 'invoice', definition: 'hóa đơn' },
      { word: 'hedging', definition: 'phòng ngừa rủi ro' },
      { word: 'budget', definition: 'ngân sách' },
      { word: 'bankruptcy', definition: 'phá sản' },
      { word: 'subsidiary', definition: 'công ty con' },
      { word: 'working capital', definition: 'vốn lưu động' },
      { word: 'cash flow', definition: 'dòng tiền' },
    ].map((f) => ({ ...f, topic: VocabularyTopic.FINANCE }));

    await this.flashcardsRepository.insert(data);
    console.log(`✅ Seeded ${data.length} Finance flashcards`);
  }

  async seedVocabularyLessonsByTopicAndLevel(
    topic: VocabularyTopic,
    level: Level,
    titleSuffix: string,
    description: string,
    content: string,
  ) {
    const count = await this.lessonRepository.count({
      where: {
        vocabulary_topic: topic,
        level: level,
      },
    });

    if (count > 0) {
      console.log(`ℹ️ ${level} ${topic} lessons already seeded`);
      return;
    }

    const lessons = [
      {
        defaultOrder: 1,
        title: `${topic} - Vocabulary - ${titleSuffix}`,
        description,
        level,
        type: Topic.VOCABULARY,
        vocabulary_topic: topic,
        grammar_topic: null,
        content,
      },
    ];

    await this.lessonRepository.insert(lessons);
    console.log(`✅ Seeded ${lessons.length} ${topic} lessons`);
  }

  async seedGrammarLessonsByTopicAndLevel(
    grammarTopic: GrammarTopic,
    level: Level,
    titleSuffix: string,
    description: string,
    content: string,
  ) {
    const count = await this.lessonRepository.count({
      where: {
        grammar_topic: grammarTopic,
        level: level,
      },
    });

    if (count > 0) {
      console.log(
        `ℹ️ ${level} grammar lessons for ${grammarTopic} already seeded`,
      );
      return;
    }

    const lessons = [
      {
        defaultOrder: 1,
        title: `${grammarTopic} - ${titleSuffix}`,
        description,
        level,
        type: Topic.GRAMMAR,
        vocabulary_topic: null,
        grammar_topic: grammarTopic,
        content,
      },
    ];

    await this.lessonRepository.insert(lessons);
    console.log(
      `✅ Seeded ${lessons.length} grammar lessons for ${grammarTopic}`,
    );
  }

  async seedAllGrammarLessons() {
    const topics = Object.values(GrammarTopic);
    const levels = [
      {
        level: Level.BEGINNER,
        suffix: 'Beginner',
        description: 'Basic grammar explanation and examples.',
        content:
          '<p>This lesson introduces the basic rules of grammar topic.</p>',
      },
      {
        level: Level.INTERMEDIATE,
        suffix: 'Intermediate',
        description: 'Intermediate grammar structures with usage tips.',
        content: '<p>This lesson explains more complex rules and usage.</p>',
      },
      {
        level: Level.ADVANCED,
        suffix: 'Advanced',
        description: 'In-depth analysis of grammar nuances and exceptions.',
        content:
          '<p>This lesson covers advanced structures and exceptions.</p>',
      },
    ];

    for (const topic of topics) {
      for (const { level, suffix, description, content } of levels) {
        await this.seedGrammarLessonsByTopicAndLevel(
          topic as GrammarTopic,
          level,
          suffix,
          description,
          content.replace('grammar topic', topic),
        );
      }
    }
  }
  async seedUserLessonProgress() {
    const existingCount = await this.lessonProgressRepository.count();
    if (existingCount > 0) {
      console.log(`ℹ️ Lesson progress already seeded. Skipping seeding.`);
      return;
    }
    const learners = await this.usersRepository.find({
      where: { role: UserRole.Learner },
    });

    const lessons = await this.lessonRepository.find();

    if (learners.length === 0 || lessons.length === 0) {
      console.log(
        '⚠️ No learners or lessons found. Skipping seeding progress.',
      );
      return;
    }

    const progresses: Partial<LessonProgress>[] = [];
    let totalSeeded = 0;

    for (const learner of learners) {
      if (totalSeeded >= 20) break;

      const shuffledLessons = lessons.sort(() => 0.5 - Math.random());

      for (const lesson of shuffledLessons) {
        if (totalSeeded >= 20) break;

        const exists = await this.lessonProgressRepository.findOne({
          where: {
            user: { id: learner.id },
            lesson: { id: lesson.id },
          },
        });

        if (exists) {
          continue;
        }

        // Random trạng thái
        const statuses: ('Not Started' | 'In Progress' | 'Completed')[] = [
          'Not Started',
          'In Progress',
          'Completed',
        ];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const startedAt = ['In Progress', 'Completed'].includes(status)
          ? new Date()
          : null;

        const completedAt =
          status === 'Completed'
            ? new Date(Date.now() + randomInt(5, 60) * 60000)
            : null;

        progresses.push({
          user: learner,
          lesson: lesson,
          status: status,
          total_correct_answers: status === 'Completed' ? randomInt(5, 11) : 0,
          started_at: startedAt || undefined,
          completed_at: completedAt || undefined,
        });

        totalSeeded++;
      }
    }

    if (progresses.length > 0) {
      await this.lessonProgressRepository.save(progresses);
      console.log(
        `✅ Seeded ${progresses.length} lesson progress records (max 20)`,
      );
    } else {
      console.log('ℹ️ No new progress records to insert');
    }
  }
}
