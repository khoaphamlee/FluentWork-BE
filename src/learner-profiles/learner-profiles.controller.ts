import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LearnerProfilesService } from './learner-profiles.service';
import { CreateLearnerProfileDto } from './dto/create-learner-profile.dto';
import { UpdateLearnerProfileDto } from './dto/update-learner-profile.dto';

@Controller('learner-profiles')
export class LearnerProfilesController {
  constructor(private readonly learnerProfilesService: LearnerProfilesService) {}

  @Post()
  create(@Body() createLearnerProfileDto: CreateLearnerProfileDto) {
    return this.learnerProfilesService.create(createLearnerProfileDto);
  }

  @Get()
  findAll() {
    return this.learnerProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learnerProfilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearnerProfileDto: UpdateLearnerProfileDto) {
    return this.learnerProfilesService.update(+id, updateLearnerProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learnerProfilesService.remove(+id);
  }
}
