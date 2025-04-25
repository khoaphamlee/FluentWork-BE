import { Injectable } from '@nestjs/common';
import { CreateUserMistakeDto } from './dto/create-user-mistake.dto';
import { UpdateUserMistakeDto } from './dto/update-user-mistake.dto';

@Injectable()
export class UserMistakesService {
  create(createUserMistakeDto: CreateUserMistakeDto) {
    return 'This action adds a new userMistake';
  }

  findAll() {
    return `This action returns all userMistakes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userMistake`;
  }

  update(id: number, updateUserMistakeDto: UpdateUserMistakeDto) {
    return `This action updates a #${id} userMistake`;
  }

  remove(id: number) {
    return `This action removes a #${id} userMistake`;
  }
}
