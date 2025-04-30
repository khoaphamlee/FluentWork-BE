import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Options')
@Controller('options')
export class OptionsController {
    constructor(private readonly optionsService: OptionsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new option' })
    @ApiResponse({ status: 201, description: 'The option has been successfully created.' })
    create(@Body() createOptionDto: CreateOptionDto) {
        return this.optionsService.create(createOptionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all options' })
    @ApiResponse({ status: 200, description: 'List all options.' })
    findAll() {
        return this.optionsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an option by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Option ID' })
    @ApiResponse({ status: 200, description: 'The option has been found.' })
    @ApiResponse({ status: 404, description: 'Option not found.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.optionsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an option by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Option ID' })
    @ApiResponse({ status: 200, description: 'The option has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Option not found.' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateOptionDto: UpdateOptionDto) {
        return this.optionsService.update(id, updateOptionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an option by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Option ID' })
    @ApiResponse({ status: 200, description: 'The option has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Option not found.' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.optionsService.remove(id);
    }

    // async onModuleInit() {
    //     await this.optionsService.createFakeData();
    // } 
}
