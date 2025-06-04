import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { EmptyBodyValidationPipe } from './common/pipes/empty-body-validation.pipe';
import { DatabaseSeederService } from './seeding/database-seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new EmptyBodyValidationPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('English Learning Website API')
    .setDescription('API documentation for English learning platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalInterceptors(new LoggingInterceptor());

  const seeder = app.get(DatabaseSeederService);
  await seeder.seed();

  await app.listen(process.env.PORT ?? 3000);
  console.log('App running on http://localhost:3000');
}
bootstrap();
