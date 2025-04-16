import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password_hash: string;

  @IsEnum(['Admin', 'Learner', 'Instructor'])
  role: 'Admin' | 'Learner' | 'Instructor';
}
