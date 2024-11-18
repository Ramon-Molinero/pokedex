import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true,
        
        // * Estas opciones permiten que los valores recibidos por los controladores sean transformados a los tipos de datos que se esperan
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      }
    )
  );
  
  app.setGlobalPrefix('api/v2');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
