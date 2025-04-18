import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Request } from '@nestjs/common';
import { UpdateProfileUserDto } from './dto/update-profile-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ReturnUserDto } from './dto/return-user-dto';

@ApiTags('Users') // Gắn thẻ cho group Swagger
@ApiBearerAuth() // Nếu sử dụng JWT
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ người dùng' })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ReturnUserDto,
    description: 'Thông tin hồ sơ người dùng',
  })
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId); // từ payload JWT
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin hồ sơ người dùng' })
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() dto: UpdateProfileUserDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(
      req.user.userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req, @Param('id') id: string) {
    const requestedId = +id;
    const currentUser = req.user;

    if (currentUser.role === 'Admin' || currentUser.userId === requestedId) {
      return this.usersService.findOne(requestedId);
    }

    throw new ForbiddenException('Bạn không có quyền truy cập người dùng này');
  }

  @Post()
  //Uncomment 2 dòng bên dưới để tạo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin') // Hoặc kiểm tra nếu id === req.user.userId
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.role !== 'Admin' && req.user.userId !== +id) {
      throw new ForbiddenException('Bạn không có quyền sửa người dùng này');
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin') // Hoặc logic tương tự trên
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
