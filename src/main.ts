import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
   

  app.enableCors({
    origin: 'https://travisto-u4ac.vercel.app',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Only set true if you need cookies or auth headers
  })
  await app.listen(process.env.PORT ?? 4000)
}
bootstrap()