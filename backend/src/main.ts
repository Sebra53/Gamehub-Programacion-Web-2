import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true, whitelist: true, forbidNonWhitelisted: true,
  }));
  const config = new DocumentBuilder()
    .setTitle('GameHub IPVG')
    .setDescription('API de torneos con roles y resultados oficiales')
    .setVersion('1.0').addBearerAuth().build();
  SwaggerModule.setup('docs', app,
    SwaggerModule.createDocument(app, config));
  await app.listen(Number(process.env.PORT || 3000));
}
void bootstrap();
