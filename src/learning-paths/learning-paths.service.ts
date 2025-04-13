import { Injectable } from '@nestjs/common';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';

@Injectable()
export class LearningPathsService {
  create(createLearningPathDto: CreateLearningPathDto) {
    return 'This action adds a new learningPath';
  }

  findAll() {
    return `This action returns all learningPaths`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learningPath`;
  }

  update(id: number, updateLearningPathDto: UpdateLearningPathDto) {
    return `This action updates a #${id} learningPath`;
  }

  remove(id: number) {
    return `This action removes a #${id} learningPath`;
  }
}
