import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { TestTemplatesService } from './test-templates.service';
import { CreateTestTemplateDto } from './dto/create-test-template.dto';
import { UpdateTestTemplateDto } from './dto/update-test-template.dto';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TestQuestion } from 'src/test-questions/entities/test-question.entity';
import { ReturnTestTemplateDto } from './dto/return-test-template.dto';
import { Question } from 'src/questions/entities/question.entity';
  
@ApiTags('Test Templates')
//@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
@Controller('test-templates')
export class TestTemplatesController {
    constructor(private readonly testTemplatesService: TestTemplatesService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new test template' })
    @ApiCreatedResponse({
        type: ReturnTestTemplateDto,
        description: 'Successfully created a new test template',
    })
    create(@Body() createTestTemplateDto: CreateTestTemplateDto) {
        return this.testTemplatesService.create(createTestTemplateDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Retrieve all test templates' })
    @ApiOkResponse({
        type: [ReturnTestTemplateDto],
        description: 'List of all test templates',
    })
    findAll() {
        return this.testTemplatesService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a test template by ID' })
    @ApiOkResponse({
        type: ReturnTestTemplateDto,
        description: 'Details of the test template',
    })
    findOne(@Param('id') id: string) {
        return this.testTemplatesService.findOne(+id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a test template by ID' })
    @ApiOkResponse({
        type: ReturnTestTemplateDto,
        description: 'Updated test template',
    })
    update(
        @Param('id') id: string,
        @Body() updateTestTemplateDto: UpdateTestTemplateDto,
    ) {
        return this.testTemplatesService.update(+id, updateTestTemplateDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a test template by ID' })
    @ApiOkResponse({ description: 'Successfully deleted the test template' })
    remove(@Param('id') id: string) {
        return this.testTemplatesService.remove(+id);
    }

    @Get(':id/questions')
    @ApiOperation({ summary: 'Get questions by test template ID' })
    async getQuestionsByTemplate(@Param('id') id: number) {
        try {
            const questions = await this.testTemplatesService.getQuestionsByTemplate(id);
            return questions;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error(error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
  