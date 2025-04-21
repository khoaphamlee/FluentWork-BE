import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';

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
  password_hash: string;
  @ApiProperty({ enum: UserRole }) // kiểu enum thì khai báo như vậy
  @IsEnum(UserRole)
  role: UserRole;
}
