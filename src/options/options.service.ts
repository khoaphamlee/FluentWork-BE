import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './entities/option.entity';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { faker } from '@faker-js/faker';
import { Question } from 'src/questions/entities/question.entity';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(createOptionDto: CreateOptionDto): Promise<Option> {
    const option = this.optionRepository.create(createOptionDto);
    return await this.optionRepository.save(option);
  }

  async findAll(): Promise<Option[]> {
    return await this.optionRepository.find({
      relations: ['question'], // Nếu muốn tự động lấy luôn question liên quan
    });
  }

  async findOne(id: number): Promise<Option> {
    const option = await this.optionRepository.findOne({
      where: { id },
      relations: ['question'],
    });
    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }
    return option;
  }

  async update(id: number, updateOptionDto: UpdateOptionDto): Promise<Option> {
    const option = await this.findOne(id);
    const updatedOption = this.optionRepository.merge(option, updateOptionDto);
    return await this.optionRepository.save(updatedOption);
  }

  async remove(id: number): Promise<void> {
    const option = await this.findOne(id);
    await this.optionRepository.remove(option);
  }

//   async createFakeData(): Promise<void> {
//     const questions = await this.questionRepository.find();
    
//     if (questions.length === 0) {
//       console.log('No questions found. Cannot create options.');
//       return;
//     }

//     const fakeOptions: Option[] = []; 

//     // Tạo 10 option giả
//     for (let i = 0; i < 10; i++) {
//       const question = faker.helpers.arrayElement(questions); 

//       const option = new Option();
//       option.question = question;
//       option.option_text = faker.lorem.sentence();
//       option.is_correct = faker.datatype.boolean();

//       fakeOptions.push(option);
//     }

//     await this.optionRepository.save(fakeOptions);
//     console.log('Fake options đã được thêm vào database!');
//   }
}
