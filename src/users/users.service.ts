import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateProfileUserDto } from './dto/update-profile-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async getHashPassword(email: string): Promise<string | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user?.password_hash || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async updateProfile(
    userId: number,
    updateProfileUserDto: UpdateProfileUserDto,
  ): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    user.username = updateProfileUserDto.username;
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto);
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    const removedUser = await this.usersRepository.remove(user);
    return removedUser;
  }

  async changePassword(userId: number, oldPw: string, newPw: string) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const match = await bcrypt.compare(oldPw, user.password_hash);
    if (!match) {
      throw new UnauthorizedException('Mật khẩu cũ không đúng');
    }

    user.password_hash = await bcrypt.hash(newPw, 10);
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }
}
