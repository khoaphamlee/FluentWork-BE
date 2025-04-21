import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';

export class UserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  fullname: string;
  @ApiProperty({ enum: UserRole })
  role: UserRole;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
