import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsEnum(['Admin', 'Learner', 'Instructor'])
  role?: 'Admin' | 'Learner' | 'Instructor';
}

export class LoginDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
}
