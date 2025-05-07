import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserMistakeDto } from './dto/create-user-mistake.dto';
import { UpdateUserMistakeDto } from './dto/update-user-mistake.dto';
import { UserMistake } from './entities/user-mistake.entity';
import { Topic } from 'src/enum/topic.enum';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';
import { User } from 'src/users/entities/user.entity';
import { GrammarTopic } from 'src/enum/grammar-topic.enum';

@Injectable()
export class UserMistakesService {
  constructor(
    @InjectRepository(UserMistake)
    private readonly userMistakeRepository: Repository<UserMistake>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserMistakeDto: CreateUserMistakeDto): Promise<UserMistake> {
    const userMistake = this.userMistakeRepository.create(createUserMistakeDto);
    return this.userMistakeRepository.save(userMistake);
  }

  async findAll(): Promise<UserMistake[]> {
    return this.userMistakeRepository.find();
  }

  async findOne(id: number): Promise<UserMistake> {
    const userMistake = await this.userMistakeRepository.findOne({
      where: { id },
    });
    if (!userMistake) {
      throw new NotFoundException(`User mistake with id ${id} not found`);
    }
    return userMistake;
  }

  async update(id: number, updateUserMistakeDto: UpdateUserMistakeDto): Promise<UserMistake> {
    const userMistake = await this.userMistakeRepository.preload({
      id,
      ...updateUserMistakeDto,
    });
    if (!userMistake) {
      throw new NotFoundException(`User mistake with id ${id} not found`);
    }
    return this.userMistakeRepository.save(userMistake);
  }

  async remove(id: number): Promise<boolean> {
    const userMistake = await this.findOne(id);
    await this.userMistakeRepository.remove(userMistake);
    return true;
  }

  async updateOrCreateUserMistake(userId: number, mistake: { type: Topic | string; vocabulary_topic: VocabularyTopic | string | null; total_mistake_count: number; grammar_topic: GrammarTopic | string | null }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    const whereCondition: any = {
      user: user,
      type: mistake.type as Topic,
    };
  
    if (mistake.vocabulary_topic !== null && mistake.vocabulary_topic !== undefined) {
      whereCondition.vocabulary_topic = mistake.vocabulary_topic as VocabularyTopic;
    }
  
    if (mistake.grammar_topic !== null && mistake.grammar_topic !== undefined) {
      whereCondition.grammar_topic = mistake.grammar_topic as GrammarTopic;
    }

    let userMistake = await this.userMistakeRepository.findOne({
      where: whereCondition,
    });
  
    if (userMistake) {
      userMistake.total_mistake_count += mistake.total_mistake_count;
      userMistake.last_updated = new Date();
      await this.userMistakeRepository.save(userMistake);
    } else {
      const newUserMistake = this.userMistakeRepository.create({
        user,
        type: mistake.type as Topic,
        vocabulary_topic: mistake.vocabulary_topic as VocabularyTopic,
        grammar_topic: mistake.grammar_topic as GrammarTopic,
        total_mistake_count: mistake.total_mistake_count,
        last_updated: new Date(),
      });
      await this.userMistakeRepository.save(newUserMistake);
    }
  }
}
