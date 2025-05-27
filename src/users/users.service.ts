import {
  BadRequestException,
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
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // ✅ Kiểm tra email
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new BadRequestException(['Email already exists']);
    }

    // ✅ Kiểm tra username
    const existingUsername = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new BadRequestException(['Username already exists']);
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // ✅ Tạo user mới
    const user = this.usersRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    const { password_hash, ...returnUser } = savedUser;

    return {
      message: ['User created successfully'],
      ...returnUser,
    };
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

  async findAll(role?: UserRole) {
    const where = role ? { role } : {};
    const users = await this.usersRepository.find({ where });
    const returnUsers = users.map(({ password_hash, ...rest }) => rest);
    return {
      message: ['List of users fetched successfully'],
      users: returnUsers,
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(['User not found']);
    }
    const { password_hash, ...returnUser } = user;
    return {
      message: ['User fetched successfully'],
      ...returnUser,
    };
  }

  async getProfile(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(['User not found']);
    }
    const { password_hash, created_at, updated_at, ...returnUser } = user;
    return {
      message: ['User profile fetched successfully'],
      ...returnUser,
    };
  }

  //
  async updateProfile(
    userId: number,
    updateProfileUserDto: UpdateUserProfileDto,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(['User not found']);
    }
    const updatedUser = Object.assign(user, updateProfileUserDto);
    await this.usersRepository.save(updatedUser);
    const { password_hash, created_at, updated_at, ...savedUser } = updatedUser;
    return {
      message: ['User profile updated successfully'],
      ...savedUser,
    };
  }

  //
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(['User not found']);
    }

    // ✅ Kiểm tra email nếu thay đổi
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException(['Email already exists']);
      }
    }

    // ✅ Kiểm tra username nếu thay đổi
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException(['Username already exists']);
      }
    }

    // ✅ Hash lại password nếu có
    if (updateUserDto.password) {
      user.password_hash = await bcrypt.hash(updateUserDto.password, 10);
    }

    // ✅ Gán các trường còn lại, bỏ password
    const { password, ...rest } = updateUserDto;
    Object.assign(user, rest);

    const savedUser = await this.usersRepository.save(user);
    const { password_hash, ...returnUser } = savedUser;

    return {
      message: ['User updated successfully'],
      ...returnUser,
    };
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(['User not found']);
    }

    const removedUser = await this.usersRepository.remove(user);
    return new MessageResponseDto('User removed successfully');
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(['User not found']);
    }

    const match = await bcrypt.compare(
      changePasswordDto.oldPw,
      user.password_hash,
    );
    if (!match) {
      throw new BadRequestException(['Old password is incorrect']);
    }

    user.password_hash = await bcrypt.hash(changePasswordDto.newPw, 10);
    await this.usersRepository.save(user);
    return new MessageResponseDto('Password changed successfully');
  }
}
