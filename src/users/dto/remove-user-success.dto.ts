import { ApiProperty } from '@nestjs/swagger';

export class RemoveUserSuccessDto {
  @ApiProperty({ example: 'Xóa người dùng thành công' })
  message: string;
}
