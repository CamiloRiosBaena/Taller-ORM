import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Biblioteca Digital')
    .setDescription('API REST para gestión de libros, autores, usuarios y préstamos')
    .setVersion('1.0')
    .addTag('autores')
    .addTag('libros')
    .addTag('usuarios')
    .addTag('prestamos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 App corriendo en http://localhost:${port}`);
  console.log(`📚 Swagger docs en http://localhost:${port}/docs`);
}
bootstrap();
