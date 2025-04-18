import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Chỉ cho phép các field có trong DTO
      forbidNonWhitelisted: true, // Nếu gửi field lạ → báo lỗi
      transform: true, // Tự động ép kiểu nếu cần
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('English Learning Website API')
    .setDescription('API documentation for English learning platform')
    .setVersion('1.0')
    .addBearerAuth() // Nếu có JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalInterceptors(new LoggingInterceptor()); // interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // áp dụng cho mọi controller và trả về dữ liệu đã xử lý @Exclude() hoặc @Expose()

  await app.listen(process.env.PORT ?? 3000);
  console.log('App running on http://localhost:3000');
}
bootstrap();
