import {
  Injectable,
  NotFoundException,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { MessageResponseDto } from 'src/common/dto/message-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordSuccessDto } from './dto/change-password-success.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfileDto } from './dto/user-profile-dto';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);
    const { password_hash, ...returnUser } = savedUser;
    return returnUser;
  }
  // gọi và chỉ trả về trong code (lộ hash_password nếu trả về cho client)
  async getHashPassword(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user?.password_hash || null;
  }
  // gọi và chỉ trả về trong code (lộ hash_password nếu trả về cho client)
  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.find();
    const returnUsers = users.map(({ password_hash, ...rest }) => rest);
    return returnUsers;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const { password_hash, ...returnUser } = user;
    return returnUser;
  }

  async getProfile(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const { password_hash, created_at, updated_at, ...returnUser } = user;
    return returnUser;
  }

  //
  async updateProfile(
    userId: number,
    updateProfileUserDto: UpdateUserProfileDto,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const updatedUser = Object.assign(user, updateProfileUserDto);
    await this.usersRepository.save(updatedUser);
    const { password_hash, created_at, updated_at, ...savedUser } = updatedUser;
    return savedUser;
  }

  //
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const updatedUser = Object.assign(user, updateUserDto);
    return await this.usersRepository.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const removedUser = await this.usersRepository.remove(user);
    return new MessageResponseDto('Xóa người dùng thành công');
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const match = await bcrypt.compare(
      changePasswordDto.oldPw,
      user.password_hash,
    );
    if (!match) {
      throw new UnauthorizedException('Mật khẩu cũ không đúng');
    }

    user.password_hash = await bcrypt.hash(changePasswordDto.newPw, 10);
    await this.usersRepository.save(user);
    return new MessageResponseDto('Mật khẩu đã thay đổi thành công');
  }
}
