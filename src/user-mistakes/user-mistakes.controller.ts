import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserMistakesService } from './user-mistakes.service';
import { CreateUserMistakeDto } from './dto/create-user-mistake.dto';
import { UpdateUserMistakeDto } from './dto/update-user-mistake.dto';

@Controller('user-mistakes')
export class UserMistakesController {
  constructor(private readonly userMistakesService: UserMistakesService) {}

  @Post()
  create(@Body() createUserMistakeDto: CreateUserMistakeDto) {
    return this.userMistakesService.create(createUserMistakeDto);
  }

  @Get()
  findAll() {
    return this.userMistakesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userMistakesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserMistakeDto: UpdateUserMistakeDto) {
    return this.userMistakesService.update(+id, updateUserMistakeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userMistakesService.remove(+id);
  }
}
