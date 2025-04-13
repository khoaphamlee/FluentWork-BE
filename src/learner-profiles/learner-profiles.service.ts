import { Injectable } from '@nestjs/common';
import { CreateLearnerProfileDto } from './dto/create-learner-profile.dto';
import { UpdateLearnerProfileDto } from './dto/update-learner-profile.dto';

@Injectable()
export class LearnerProfilesService {
  create(createLearnerProfileDto: CreateLearnerProfileDto) {
    return 'This action adds a new learnerProfile';
  }

  findAll() {
    return `This action returns all learnerProfiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learnerProfile`;
  }

  update(id: number, updateLearnerProfileDto: UpdateLearnerProfileDto) {
    return `This action updates a #${id} learnerProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} learnerProfile`;
  }
}
