import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { Question } from 'src/questions/entities/question.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Option, Question])],
    controllers: [OptionsController],
    providers: [OptionsService],
    exports: [OptionsService, TypeOrmModule],
})
export class OptionsModule {}
