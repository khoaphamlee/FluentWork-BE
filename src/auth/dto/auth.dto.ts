import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username: string;
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullname: string;
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;
}
