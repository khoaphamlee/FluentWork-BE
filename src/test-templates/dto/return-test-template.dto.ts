import { ApiProperty } from '@nestjs/swagger';

export class ReturnTestTemplateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  createdAt: Date;
}
