import { PartialType } from '@nestjs/swagger';
import { CreateUserMistakeDto } from './create-user-mistake.dto';

export class UpdateUserMistakeDto extends PartialType(CreateUserMistakeDto) {}
