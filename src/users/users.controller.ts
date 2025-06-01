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
  Query,
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
  ApiQuery,
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
    status: 200,
    description: 'User profile fetched successfully',
    schema: {
      example: {
        message: ['User profile fetched successfully'],
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        fullname: 'Administrator',
        role: 'Admin',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: ['User not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UseGuards(JwtAuthGuard) // API chỉ cho phép truy cập nếu người dùng đã đăng nhập và gửi kèm access_token hợp lệ trong request.
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin hồ sơ người dùng' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    schema: {
      example: {
        message: ['User profile updated successfully'],
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        fullname: 'Admin',
        role: 'Admin',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: ['User not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() dto: UpdateUserProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      example: {
        message: ['Password changed successfully'],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Old password incorrect',
    schema: {
      example: {
        message: ['Old password is incorrect'],
        error: 'Bad Request',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: ['User not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() body: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, body);
  }

  @Get('')
  @ApiOperation({ summary: 'Danh sách tất cả người dùng trong hệ thống' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ['Admin', 'Learner', 'Instructor'],
    description: 'Lọc người dùng theo vai trò',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users fetched successfully',
    schema: {
      example: {
        message: ['List of users fetched successfully'],
        users: [
          {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            fullname: 'Administrator',
            role: 'Admin',
          },
        ],
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin) // Chỉ admin mới có thể truy cập vào API dưới
  findAll(@Query('role') role?: UserRole) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng trong hệ thống' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
    schema: {
      example: {
        message: ['User fetched successfully'],
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        fullname: 'Administrator',
        role: 'Admin',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: ['User not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
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
    description: 'User created successfully',
    schema: {
      example: {
        message: ['User created successfully'],
        id: 2,
        username: 'newuser',
        email: 'new@example.com',
        fullname: 'New User',
        role: 'Learner',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation or business rule)',
    content: {
      'application/json': {
        examples: {
          ValidationError: {
            summary: 'Validation error',
            value: {
              message: ['Email must be a valid email'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          EmailExists: {
            summary: 'Email already exists',
            value: {
              message: ['Email already exists'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          UsernameExists: {
            summary: 'Username already exists',
            value: {
              message: ['Username already exists'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        },
      },
    },
  })

  // Uncomment 2 dòng bên dưới để tạo Admin
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng trong hệ thống' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      example: {
        message: ['User updated successfully'],
        id: 1,
        username: 'updateduser',
        email: 'updated@example.com',
        fullname: 'Updated User',
        role: 'Instructor',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: ['User not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation or business rule)',
    content: {
      'application/json': {
        examples: {
          ValidationError: {
            summary: 'Validation error',
            value: {
              message: ['Email must be a valid email'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          EmailExists: {
            summary: 'Email already exists',
            value: {
              message: ['Email already exists'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          UsernameExists: {
            summary: 'Username already exists',
            value: {
              message: ['Username already exists'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        },
      },
    },
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
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: {
        message: ['User removed successfully'],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message: ['User not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
