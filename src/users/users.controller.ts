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
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Request } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

import { MessageResponseDto } from 'src/common/dto/message-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordSuccessDto } from './dto/change-password-success.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserProfileDto } from './dto/user-profile-dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserDto } from './dto/user-dto';
import { RemoveUserSuccessDto } from './dto/remove-user-success.dto';
import { EmptyBodyValidationPipe } from 'src/common/pipes/empty-body-validation.pipe';

@ApiTags('Users') // Gắn thẻ cho group Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ người dùng' })
  @ApiBearerAuth() // bảo vệ API bằng cách xác thực access_token
  @ApiResponse({
    status: 201,
    type: UserProfileDto,
    description: 'Thông tin hồ sơ người dùng',
  })
  @UseGuards(JwtAuthGuard) // API chỉ cho phép truy cập nếu người dùng đã đăng nhập và gửi kèm access_token hợp lệ trong request.
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin hồ sơ người dùng' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: UserProfileDto,
    description: 'Thông tin hồ sơ người dùng đã được cập nhật',
  })
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() dto: UpdateUserProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: ChangePasswordSuccessDto,
    description: 'Mật khẩu đã thay đổi',
  })
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() body: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, body);
  }

  @Get('')
  @ApiOperation({ summary: 'Danh sách tất cả người dùng trong hệ thống' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: UserDto,
    isArray: true,
    description: 'Danh sách người dùng',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin) // Chỉ admin mới có thể truy cập vào API dưới
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng trong hệ thống' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: UserDto,
    description: 'Người dùng',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async findOne(@Request() req, @Param('id') id: string) {
    const requestedId = +id;
    return this.usersService.findOne(requestedId);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng trong hệ thống' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: User,
    description: 'Người dùng',
  })
  //Uncomment 2 dòng bên dưới để tạo Admin
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles('Admin')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng trong hệ thống' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: UserDto,
    description: 'Người dùng',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng trong hệ thống' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: RemoveUserSuccessDto,
    description: 'Người dùng',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
