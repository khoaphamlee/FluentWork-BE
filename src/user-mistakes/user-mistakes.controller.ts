import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserMistakesService } from './user-mistakes.service';
import { CreateUserMistakeDto } from './dto/create-user-mistake.dto';
import { UpdateUserMistakeDto } from './dto/update-user-mistake.dto';
import { NotFoundException } from '@nestjs/common';

@Controller('user-mistakes')
export class UserMistakesController {
  constructor(private readonly userMistakesService: UserMistakesService) {}

  @Post()
  async create(@Body() createUserMistakeDto: CreateUserMistakeDto) {
    return this.userMistakesService.create(createUserMistakeDto);
  }

  @Get()
  async findAll() {
    return this.userMistakesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.userMistakesService.findOne(+id);  // Chuyển id sang number
    if (!result) {
      throw new NotFoundException(`User mistake with id ${id} not found`);
    }
    return result;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserMistakeDto: UpdateUserMistakeDto) {
    const updatedMistake = await this.userMistakesService.update(+id, updateUserMistakeDto);
    if (!updatedMistake) {
      throw new NotFoundException(`User mistake with id ${id} not found`);
    }
    return updatedMistake;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const success = await this.userMistakesService.remove(+id);
    if (!success) {
      throw new NotFoundException(`User mistake with id ${id} not found`);
    }
    return { message: `User mistake with id ${id} successfully removed` };
  }
}
