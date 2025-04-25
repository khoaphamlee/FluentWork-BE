import { Injectable } from '@nestjs/common';
import { CreateTestMistakeDto } from './dto/create-test-mistake.dto';
import { UpdateTestMistakeDto } from './dto/update-test-mistake.dto';

@Injectable()
export class TestMistakesService {
  create(createTestMistakeDto: CreateTestMistakeDto) {
    return 'This action adds a new testMistake';
  }

  findAll() {
    return `This action returns all testMistakes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testMistake`;
  }

  update(id: number, updateTestMistakeDto: UpdateTestMistakeDto) {
    return `This action updates a #${id} testMistake`;
  }

  remove(id: number) {
    return `This action removes a #${id} testMistake`;
  }
}
