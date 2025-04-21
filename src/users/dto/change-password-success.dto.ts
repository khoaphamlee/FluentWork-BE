import { ApiProperty } from '@nestjs/swagger';
import { MessageResponseDto } from 'src/common/dto/message-response.dto';

export class ChangePasswordSuccessDto {
  @ApiProperty({ example: 'Mật khẩu đã thay đổi thành công' })
  message: string;
}
