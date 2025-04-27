import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, ForgotPasswordDto } from './dto/auth.dto';
import { User } from '../users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserDto } from 'src/users/dto/user-dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { username, email, password, fullname } = dto;

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new Error('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      username,
      email,
      fullname,
      password_hash: hashedPassword,
      role: UserRole.Learner,
    });
    const { created_at, updated_at, ...returnUser } = newUser;
    return returnUser;
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = dto;
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const user_password_hash = await this.usersService.getHashPassword(
      user.email,
    );

    if (!user_password_hash) {
      throw new UnauthorizedException('Không tìm thấy mật khẩu người dùng');
    }

    const sanitizedHash = user.password_hash.replace('$2y$', '$2a$');
    const isMatch = await bcrypt.compare(password, sanitizedHash);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email, newPassword, confirmPassword } = dto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email không tồn tại trong hệ thống');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;

    await this.usersRepository.save(user);

    return { message: 'Đổi mật khẩu thành công' };
  }
}
