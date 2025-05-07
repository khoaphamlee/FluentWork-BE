import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    NotFoundException,
    BadRequestException,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import { TestsService } from './tests.service';
  import { CreateTestDto } from './dto/create-test.dto';
  import { UpdateTestDto } from './dto/update-test.dto';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Test } from './entities/test.entity';
  import { Repository } from 'typeorm';
import { SubmitTestDto } from './dto/submit-test.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from '@nestjs/common';
  
  @Controller('tests')
  export class TestsController {
    constructor(
      @InjectRepository(Test)
      private readonly testRepository: Repository<Test>,
      private readonly testsService: TestsService,
    ) {}
  
    @Post()
    create(@Body() createTestDto: CreateTestDto) {
      return this.testsService.create(createTestDto);
    }

    // @Post('entry')
    // createEntryTest(@Body() createTestDto: CreateTestDto) {
    //     return this.testsService.createEntryTest(createTestDto);
    // }
  
    @Get()
    findAll() {
      return this.testsService.findAll();
    }
  
    // @Get('questions') 
    // async findAllQuestions() {
    //   const tests = await this.testRepository.find({
    //     relations: ['testQuestions', 'testQuestions.question'],
    //   });
  
    //   if (!tests || tests.length === 0) {
    //     throw new NotFoundException('No tests found.');
    //   }
  
    //   const allQuestions = tests.flatMap(test =>
    //     test.testQuestions.map(testQuestion => ({
    //       testId: test.id,
    //       questionId: testQuestion.question.id,
    //       questionText: testQuestion.question.question_text,
    //       options: testQuestion.question.options,
    //       difficulty: testQuestion.question.level,
    //       topic: testQuestion.question.topic,
    //       category: testQuestion.question.vocabulary_topic,
    //     })),
    //   );
    //   return allQuestions;
    // }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.testsService.findOne(+id);
    }
  
    // @Get(':testId/questions')
    // async getTestQuestions(@Param('testId') testId: string) {
    //   const id = parseInt(testId, 10);
    //   if (isNaN(id)) {
    //     throw new BadRequestException('Invalid ID provided');
    //   }
  
    //   const test = await this.testRepository.findOne({
    //     where: { id },
    //     relations: ['testQuestions', 'testQuestions.question'],
    //   });
  
    //   if (!test) {
    //     throw new NotFoundException(`Test with id ${id} not found`);
    //   }
  
    //   if (!test.testQuestions || test.testQuestions.length === 0) {
    //     throw new NotFoundException(`No questions found for test id ${id}`);
    //   }
  
    //   return test.testQuestions.map(tq => ({
    //     questionId: tq.question.id,
    //     questionText: tq.question.question_text,
    //     options: tq.question.options,
    //     difficulty: tq.question.level,
    //     topic: tq.question.topic,
    //     category: tq.question.vocabulary_topic,
    //   }));
    // }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
      return this.testsService.update(+id, updateTestDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.testsService.remove(+id);
    }

    @Get(':id/questions')
    async getQuestions(@Param('id', ParseIntPipe) id: number) {
        return await this.testsService.getQuestions(id);
    }

    @Post(':id/submit')
    @UseGuards(JwtAuthGuard)
    submitTest(
    @Param('id') id: number,
    @Body() dto: SubmitTestDto,
    @Request() req: any,
    ) {
        const userId = req.user.userId;
        return this.testsService.submitTest(+id, dto.answers, userId);
    }



}
  
  