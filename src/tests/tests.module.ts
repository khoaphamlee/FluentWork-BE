import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { Test } from './entities/test.entity';
import { User } from '../users/entities/user.entity';
import { TestTemplate } from 'src/test-templates/entities/test-template.entity';
import { TestTemplatesModule } from 'src/test-templates/test-templates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test, User, TestTemplate]),
    TestTemplatesModule,
  ],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
