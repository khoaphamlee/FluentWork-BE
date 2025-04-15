import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Chỉ cho phép các field có trong DTO
      forbidNonWhitelisted: true, // Nếu gửi field lạ → báo lỗi
      transform: true, // Tự động ép kiểu nếu cần
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)), // áp dụng @Exclude() cho tất cả các Entity
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('App running on http://localhost:3000');
}
bootstrap();
