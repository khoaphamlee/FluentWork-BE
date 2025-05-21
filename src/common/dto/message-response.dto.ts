import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto<T = any> {
  @ApiProperty({ example: 'Thành công' })
  message: string[];

  @ApiProperty({ required: false })
  data?: T;

  constructor(message: string, data?: T) {
    this.message = [message];
    if (data !== undefined) {
      this.data = data;
    }
  }
}
