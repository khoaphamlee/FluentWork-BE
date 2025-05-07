import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestAnswer } from './entities/test-answer.entity';
import { CreateTestAnswerDto } from './dto/create-test-answer.dto';
import { UpdateTestAnswerDto } from './dto/update-test-answer.dto';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { Option } from 'src/options/entities/option.entity';

@Injectable()
export class TestAnswersService {
  constructor(
    @InjectRepository(TestAnswer)
    private testAnswerRepository: Repository<TestAnswer>,

    @InjectRepository(TestQuestion)
    private testQuestionRepository: Repository<TestQuestion>,

    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  async create(createTestAnswerDto: CreateTestAnswerDto): Promise<TestAnswer> {
    const { test_question_id, option_id } = createTestAnswerDto;

    const testQuestion = await this.testQuestionRepository.findOne({
      where: { id: test_question_id },
    });
    if (!testQuestion) {
      throw new NotFoundException('Test question not found');
    }

    const option = await this.optionRepository.findOne({
      where: { id: option_id },
    });
    if (!option) {
      throw new NotFoundException('Option not found');
    }

    const isCorrect = option.is_correct;

    const testAnswer = this.testAnswerRepository.create({
      testQuestion,
      option,
      is_correct: isCorrect,
    });

    return this.testAnswerRepository.save(testAnswer);
  }

  findAll(): Promise<TestAnswer[]> {
    return this.testAnswerRepository.find({
      relations: ['testQuestion', 'option'],
    });
  }

  async findOne(id: number): Promise<TestAnswer> {
    const answer = await this.testAnswerRepository.findOne({
      where: { id },
      relations: ['testQuestion', 'option'],
    });
    if (!answer) {
      throw new NotFoundException('Test answer not found');
    }
    return answer;
  }

  async update(id: number, updateTestAnswerDto: UpdateTestAnswerDto): Promise<TestAnswer> {
    const testAnswer = await this.findOne(id);

    if (updateTestAnswerDto.option_id) {
      const newOption = await this.optionRepository.findOneBy({ id: updateTestAnswerDto.option_id });
      if (!newOption) throw new NotFoundException('New option not found');
      testAnswer.option = newOption;
      testAnswer.is_correct = newOption.is_correct;
    }

    return this.testAnswerRepository.save(testAnswer);
  }

  async remove(id: number): Promise<boolean> {
    const testAnswer = await this.testAnswerRepository.findOne({
      where: { id }, 
    });

    if (!testAnswer) {
      return false;
    }

    await this.testAnswerRepository.remove(testAnswer); 
    return true; 
  }
}
