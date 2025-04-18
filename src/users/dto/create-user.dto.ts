import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  fullname: string;
  @ApiProperty()
  @IsString()
  @MinLength(6)
  password_hash: string;
  @ApiProperty()
  @IsEnum(['Admin', 'Learner', 'Instructor'])
  role: 'Admin' | 'Learner' | 'Instructor';
}
