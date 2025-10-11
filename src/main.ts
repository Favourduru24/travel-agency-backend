import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as path from 'path';
// import * as fs from "fs"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  // const uploadDirectory = path.join(__dirname, "..", "upload")

  //  if(!fs.existsSync(uploadDirectory)) {
  //   fs.mkdirSync(uploadDirectory)
  //  } 

  app.enableCors({
    origin: 'http://localhost:3000', // Allow all origins (not safe for production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Only set true if you need cookies or auth headers
  });
  await app.listen(process.env.PORT ?? 4000
}
bootstrap();

//npm i --save @types/multer 
