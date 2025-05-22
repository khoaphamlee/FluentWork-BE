import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FlashcardsService } from './flashcards.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { Flashcard } from './entities/flashcard.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { VocabularyTopic } from 'src/enum/vocabulary-topic.enum';

@ApiTags('Flashcards')
@ApiBearerAuth()
@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Instructor)
  @ApiOperation({ summary: 'Create a new flashcard' })
  @ApiResponse({
    status: 201,
    description: 'Flashcard created successfully',
    schema: {
      example: {
        message: ['Flashcard created successfully'],
        id: 1,
        word: 'cloud',
        definition: 'a visible mass of condensed water vapor',
        topic: 'Weather',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        message: ['Access denied'],
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  create(@Body() createFlashcardDto: CreateFlashcardDto) {
    return this.flashcardsService.create(createFlashcardDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Search flashcards by filters' })
  @ApiQuery({
    name: 'topic',
    enum: VocabularyTopic,
    required: false,
    description: 'Vocabulary topic',
  })
  @ApiQuery({
    name: 'word',
    required: false,
    description: 'Search by word',
  })
  @ApiQuery({
    name: 'definition',
    required: false,
    description: 'Search by definition (partial match)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of matched flashcards',
    schema: {
      example: {
        message: ['Flashcards fetched successfully'],
        flashcards: [
          {
            id: 1,
            word: 'cloud',
            definition: 'a visible mass of condensed water vapor',
            topic: 'Weather',
          },
        ],
      },
    },
  })
  findAll(
    @Query('topic') topic?: VocabularyTopic,
    @Query('word') word?: string,
    @Query('definition') definition?: string,
  ) {
    return this.flashcardsService.findAll({ topic, word, definition });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get flashcard by ID' })
  @ApiResponse({
    status: 200,
    description: 'Flashcard found',
    schema: {
      example: {
        message: ['Flashcard fetched successfully'],
        id: 1,
        word: 'cloud',
        definition: 'a visible mass of condensed water vapor',
        topic: 'Weather',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Flashcard not found',
    schema: {
      example: {
        message: ['Flashcard not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.flashcardsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Instructor)
  @ApiOperation({ summary: 'Update flashcard' })
  @ApiResponse({
    status: 200,
    description: 'Flashcard updated successfully',
    schema: {
      example: {
        message: ['Flashcard updated successfully'],
        id: 1,
        word: 'cloud',
        definition: 'a fluffy white thing in the sky',
        topic: 'Weather',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        message: ['Access denied'],
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Flashcard not found',
    schema: {
      example: {
        message: ['Flashcard not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateFlashcardDto) {
    return this.flashcardsService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Instructor)
  @ApiOperation({ summary: 'Delete a flashcard' })
  @ApiResponse({
    status: 200,
    description: 'Flashcard deleted successfully',
    schema: {
      example: {
        message: ['Flashcard removed successfully'],
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        message: ['Access denied'],
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Flashcard not found',
    schema: {
      example: {
        message: ['Flashcard not found'],
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.flashcardsService.remove(+id);
  }
}
