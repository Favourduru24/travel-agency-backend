import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: 'http://localhost:3000', // Allow all origins (not safe for production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Only set true if you need cookies or auth headers
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
