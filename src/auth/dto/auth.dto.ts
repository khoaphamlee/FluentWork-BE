import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;
  @IsString()
  fullname: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
}
