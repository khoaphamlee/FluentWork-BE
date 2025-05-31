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
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePlacementTestDto } from './dto/create-placement-test.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/auth/roles.decorator';
  
@ApiTags('Tests')
@ApiBearerAuth()
@Controller('tests')
export class TestsController {
    constructor(
      @InjectRepository(Test)
      private readonly testRepository: Repository<Test>,
      private readonly testsService: TestsService,
    ) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Learner)
    @ApiOperation({ summary: 'Create a test' })
    @ApiBody({
    type: CreateTestDto,
    description: 'Example payload to create a test',
    schema: {
        example: {
        level: 'Intermediate',
        type: 'Vocabulary',
        vocabulary_topic: ['Business'],
        duration: '0m',
        test_date: '2025-05-17T10:00:00.000Z',
        total_correct_answers: 0,
        total_incorrect_answers: 0,
        },
    },
    })
    @ApiResponse({ status: 201, description: 'Test created successfully.' })
    @ApiResponse({ status: 400, description: 'Validation error.' })
    create(@Request() req, @Body() createTestDto: CreateTestDto) {
    const user = req.user;
    return this.testsService.create(user, createTestDto);
    }

    @Post('placement')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Learner)
    @ApiOperation({ summary: 'Create a placement test (10 questions)' })
    @ApiBody({
    type: CreatePlacementTestDto,
    schema: {
        example: {
            duration: '15m',
            test_date: '2025-05-17T08:00:00Z',
        },
    },
    })
    @ApiResponse({ status: 201, description: 'Placement test created.' })
    createPlacement(@Request() req, @Body() dto: CreatePlacementTestDto) {
        console.log('👤 Logged in user from request:', req.user);
        const user = req.user as any;
        return this.testsService.createPlacementTest(user, dto);
    }


    @Get()
    @ApiOperation({ summary: 'Get all tests' })
    @ApiResponse({ status: 200, description: 'List of all tests.' })
    findAll() {
      return this.testsService.findAll();
    }

    @Get('placement/me')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Learner)
    @ApiOperation({ summary: 'Get the current user’s placement test' })
    @ApiResponse({ status: 200, description: 'Placement test found.' })
    @ApiResponse({ status: 404, description: 'Placement test not found.' })
    getPlacementTestForUser(@Request() req) {
        console.log('Request user:', req.user);
        const userId = req.user.id;
        return this.testsService.getPlacementTestForUser(userId);
    }

  
    @Get(':id')
    @ApiOperation({ summary: 'Get a test by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Test found.' })
    @ApiResponse({ status: 404, description: 'Test not found.' })
    findOne(@Param('id') id: string) {
      return this.testsService.findOne(+id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a test' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateTestDto })
    @ApiResponse({ status: 200, description: 'Test updated successfully.' })
    update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
      return this.testsService.update(+id, updateTestDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a test by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Test deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Test not found.' })
    remove(@Param('id') id: string) {
      return this.testsService.remove(+id);
    }

    @Get(':id/questions')
    @ApiOperation({ summary: 'Get all questions in a test' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Questions fetched successfully.' })
    async getQuestions(@Param('id', ParseIntPipe) id: number) {
        return await this.testsService.getQuestions(id);
    }

    @Post(':id/submit')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Submit answers for a test' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: SubmitTestDto })
    @ApiResponse({ status: 201, description: 'Test submitted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    submitTest(
    @Param('id') id: number,
    @Body() dto: SubmitTestDto,
    @Request() req: any,
    ) {
        const userId = req.user.userId;
        return this.testsService.submitTest(+id, dto.answers, userId);
    }

    @Post(':id/submit-placement')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Submit a placement test and auto assign level' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: SubmitTestDto })
    @ApiResponse({ status: 201, description: 'Placement test submitted and level assigned.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    submitPlacementTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubmitTestDto,
    @Request() req: any,
    ) {
        const userId = req.user.userId;
        return this.testsService.submitPlacementTest(id, dto, userId);
    }
}
  
  