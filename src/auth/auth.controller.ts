import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto } from './dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileDto } from 'src/users/dto/user-profile-dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        message: ['User registered successfully'],
        id: 2,
        username: 'newuser',
        email: 'newuser@example.com',
        fullname: 'New User',
        role: 'Learner',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email already exists',
    schema: {
      example: {
        message: ['Email already exists'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, return access_token',
    schema: {
      example: {
        message: ['Login successful'],
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect password',
    schema: {
      example: {
        message: ['Incorrect password'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Email not found',
    schema: {
      example: {
        message: ['Email not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password - set new password by email' })
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
    status: 400,
    description: 'Confirm password does not match',
    schema: {
      example: {
        message: ['Confirm password does not match'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Email does not exist',
    schema: {
      example: {
        message: ['Email does not exist'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }
}
