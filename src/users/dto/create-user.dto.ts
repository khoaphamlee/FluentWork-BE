import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  fullname: string;
  @IsString()
  @MinLength(6)
  password_hash: string;
  @IsEnum(['Admin', 'Learner', 'Instructor'])
  role: 'Admin' | 'Learner' | 'Instructor';
}
